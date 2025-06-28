// src/pages/Upload.js
import React from 'react';

const Upload = () => {
  return (
    <div>
      <h2>Publier une Vidéo</h2>
      <p>Partagez votre recette ou plat avec la communauté.</p>
      {/* À connecter à l'API /api/videos */}
      <form>
        <label>
          Description :
          <input type="text" placeholder="Décrivez votre plat..." />
        </label>
        <label>
          Vidéo :
          <input type="file" accept="video/*" />
        </label>
        <button type="submit">Publier</button>
      </form>
    </div>
  );
};

export default Upload;
