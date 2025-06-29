import React from "react";

function Home() {
  return React.createElement(
    "div",
    { style: { padding: 20 } },
    React.createElement("h2", null, "Accueil"),
    React.createElement("p", null, "Bienvenue sur l'application de vidéos sociales.")
  );
}

export default Home;
