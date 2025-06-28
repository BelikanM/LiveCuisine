// src/pages/Profile.js
import React from 'react';

const Profile = () => {
  return (
    <div>
      <h2>Mon Profil</h2>
      <p>Vos informations et vidéos publiées.</p>
      {/* À connecter à l'API /api/users/:id et /api/users/:id/videos */}
      <div className="profile-info">
        <p>Nom d'utilisateur : [À venir]</p>
        <p>Avatar : [À venir]</p>
      </div>
      <div className="user-videos">
        <p>[Vos vidéos à venir]</p>
      </div>
    </div>
  );
};

export default Profile;
