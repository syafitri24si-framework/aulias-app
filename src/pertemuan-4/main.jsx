import React from "react";
import { createRoot } from "react-dom/client";
import WonderApp from "./WonderApp";
import "./tailwind.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WonderApp />
  </React.StrictMode>
);