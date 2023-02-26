import { StrictMode } from "react";
import { render } from "react-dom";
import App from "./App";
import reactDatePickerStyle from "react-datepicker/dist/react-datepicker.css?inline";
import tailwindStyle from "./tailwind.css?inline";

const root = document.createElement("div");
root.style.cssText = `
margin-left: 84px;
padding: 24px;
max-width: 1366px;
box-sizing: border-box;
`;

const shadowRoot = root.attachShadow({ mode: "open" });

document.querySelector("body")!.prepend(root);
render(
  <StrictMode>
    <style>{tailwindStyle}</style>
    <style>{reactDatePickerStyle}</style>
    <style>{".react-datepicker-popper {z-index: 11;}"}</style>
    <App />
  </StrictMode>,
  shadowRoot
);
