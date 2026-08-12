import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

export type PrePushDependencies = Readonly<{
  isCommit: (oid: string) => boolean;
  lint: (message: string) => boolean;
  listCommits: (localOid: string, remoteOid: string | undefined, remoteName: string) => string[];
  readMessage: (oid: string) => string;
}>;

type RefUpdate = Readonly<{
  localOid: string;
  remoteOid: string;
}>;

export function isPrePushInputValid(
  input: string,
  remoteName: string,
  dependencies: PrePushDependencies,
): boolean {
  if (!remoteName) {
    throw new Error("pre-push remote name is required");
  }

  const linted = new Set<string>();

  for (const { localOid, remoteOid } of parseRefUpdates(input)) {
    if (isZeroOid(localOid) || !dependencies.isCommit(localOid)) {
      continue;
    }

    const excludedOid =
      !isZeroOid(remoteOid) && dependencies.isCommit(remoteOid) ? remoteOid : undefined;
    const commits = dependencies.listCommits(localOid, excludedOid, remoteName);

    if (commits.some((commit) => !isCommitValid(commit, linted, dependencies))) {
      return false;
    }
  }

  return true;
}

function gitOutput(args: string[]): string {
  const result = spawnSync("git", args, { encoding: "utf-8" });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args.join(" ")} failed`);
  }

  return result.stdout;
}

function isCommitValid(
  commit: string,
  linted: Set<string>,
  dependencies: PrePushDependencies,
): boolean {
  if (linted.has(commit)) {
    return true;
  }

  linted.add(commit);

  return dependencies.lint(dependencies.readMessage(commit));
}

function isZeroOid(oid: string): boolean {
  return /^0+$/u.test(oid);
}

function parseRefUpdates(input: string): RefUpdate[] {
  if (!input.trim()) {
    return [];
  }

  return input
    .trim()
    .split(/\r?\n/u)
    .map((line) => {
      const fields = line.trim().split(/\s+/u);
      const localOid = fields[1];
      const remoteOid = fields[3];

      if (localOid === undefined || remoteOid === undefined || fields.length !== 4) {
        throw new Error(`invalid pre-push input: ${line}`);
      }

      return { localOid, remoteOid };
    });
}

const defaultDependencies: PrePushDependencies = {
  isCommit: (oid) => {
    const result = spawnSync("git", ["cat-file", "-e", oid + "^{commit}"], { stdio: "ignore" });

    if (result.error) {
      throw result.error;
    }

    return result.status === 0;
  },
  lint: (message) => {
    const executable = process.platform === "win32" ? "nozo-commitlint.cmd" : "nozo-commitlint";
    const command = path.join(process.cwd(), "node_modules", ".bin", executable);
    const result = spawnSync(command, ["--verbose"], {
      input: message,
      stdio: ["pipe", "inherit", "inherit"],
    });

    if (result.error) {
      throw result.error;
    }

    return result.status === 0;
  },
  listCommits: (localOid, remoteOid, remoteName) => {
    const exclusion = remoteOid ?? `--remotes=${remoteName}`;
    const output = gitOutput(["rev-list", "--reverse", localOid, "--not", exclusion]).trim();

    return output ? output.split(/\r?\n/u) : [];
  },
  readMessage: (oid) => gitOutput(["show", "--quiet", "--format=%B", oid]),
};

export function runPrePushCli(remoteName = process.argv[2]): number {
  try {
    const input = readFileSync(0, "utf-8");

    return isPrePushInputValid(input, remoteName ?? "", defaultDependencies) ? 0 : 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`pre-push commitlint failed: ${message}\n`);

    return 1;
  }
}

const entrypoint = process.argv[1];

if (entrypoint !== undefined && import.meta.url === new URL(entrypoint, "file:").href) {
  process.exitCode = runPrePushCli();
}
