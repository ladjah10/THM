import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Apply protection utilities to prevent screenshots
import "./utils/protectionUtils";

createRoot(document.getElementById("root")!).render(<App />);
