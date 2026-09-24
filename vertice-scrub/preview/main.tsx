import Inicio from "@/app/page";

declare const ReactDOM: { createRoot(el: Element): { render(node: unknown): void } };

ReactDOM.createRoot(document.getElementById("app")!).render(<Inicio />);
