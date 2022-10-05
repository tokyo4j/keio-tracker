import { StrictMode } from "react";
import { render } from "react-dom";
import App from "./App";

import "./react-datepicker.css";
import "./style.sass";

const body = document.querySelector("body")!;
const root = document.createElement("div");
root.style.cssText = `
margin-left: 60px;
padding: 20px;
`;
body.prepend(root);

render(
  <StrictMode>
    <App />
  </StrictMode>,
  root
);
