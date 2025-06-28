// src/pages/Home.js
import React from 'react';

const Home = () => {
  return (
    <div>
      <h2>Bienvenue sur Platstream</h2>
      <p>Découvrez les dernières vidéos de plats et recettes partagées par la communauté.</p>
      {/* À connecter à l'API /api/feed/latest */}
      <div className="video-grid">
        <p>[Flux de vidéos à venir]</p>
      </div>
    </div>
  );
};

export default Home;
