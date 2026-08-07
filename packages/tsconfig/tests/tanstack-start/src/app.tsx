import "./styles.css";

export function App() {
  return <main data-mode={import.meta.env.MODE}>{document.title}</main>;
}
