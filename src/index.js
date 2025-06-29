import React from "react";
import ReactDOM from "react-dom/client"; // ⬅️ important : utiliser `react-dom/client`
import App from "./App";

// Sélectionne l'élément racine HTML
const rootElement = document.getElementById("root");

// Crée un root et monte l'app
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App));
