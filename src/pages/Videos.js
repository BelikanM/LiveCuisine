import React from "react";

function Videos() {
  return React.createElement(
    "div",
    { style: { padding: 20 } },
    React.createElement("h2", null, "Vidéos"),
    React.createElement("p", null, "Liste des vidéos publiées par les utilisateurs.")
  );
}

export default Videos;
