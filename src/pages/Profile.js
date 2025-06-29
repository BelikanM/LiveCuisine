import React from "react";

function Profile() {
  return React.createElement(
    "div",
    { style: { padding: 20 } },
    React.createElement("h2", null, "Profil"),
    React.createElement("p", null, "Informations de l'utilisateur connecté.")
  );
}

export default Profile;
