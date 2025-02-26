import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root")!;
// Add dark mode class support
rootElement.classList.add("min-h-screen");
rootElement.classList.add("bg-background");
rootElement.classList.add("text-foreground");

createRoot(rootElement).render(<App />);