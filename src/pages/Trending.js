// src/pages/Trending.js
import React from 'react';

const Trending = () => {
  return (
    <div>
      <h2>Vidéos Tendances</h2>
      <p>Regardez les vidéos de plats les plus populaires du moment.</p>
      {/* À connecter à l'API /api/feed/trending */}
      <div className="video-grid">
        <p>[Vidéos tendances à venir]</p>
      </div>
    </div>
  );
};

export default Trending;
