const path = require('path');

const config = {
  version: '0.2',
  language: 'en',
  // 外部辞書
  // cspellの辞書一覧 https://github.com/streetsidesoftware/cspell-dicts#all-dictionaries
  import: [],

  // カスタム辞書 https://cspell.org/docs/dictionaries-custom/
  // 人名、プロジェクト依存、他のプロジェクトでも使えそうな単語集みたいなかんじで分類分けできたらいいかもしれない。
  dictionaryDefinitions: [
    {
      name: 'custom-dictionary',
      path: path.resolve(__dirname, './dictionaries/customised.txt'),
      addWords: true,
    },
  ],
  dictionaries: [
    // Built-in dictionaries (alphabetical ascending order)
    'bash',
    'companies',
    'css',
    'docker',
    'dotnet',
    'en_US',
    'en-gb',
    'filetypes',
    'fonts',
    'fullstack',
    'html',
    'html-symbol-entities',
    'networking-terms',
    'node',
    'npm',
    'public-licenses',
    'python',
    'rust',
    'softwareTerms',
    'typescript',
    // Custom dictionaries
    'custom-dictionary',
  ],
  ignorePaths: [],
};

module.exports = config;
