// src/pages/Login.js
import React from 'react';

const Login = () => {
  return (
    <div>
      <h2>Connexion à Platstream</h2>
      <p>Connectez-vous pour partager et découvrir des plats.</p>
      {/* À connecter à l'API /api/login et /api/auth/google */}
      <form>
        <label>
          Email :
          <input type="email" placeholder="Votre email" />
        </label>
        <label>
          Mot de passe :
          <input type="password" placeholder="Votre mot de passe" />
        </label>
        <button type="submit">Se connecter</button>
      </form>
      <p>Ou connectez-vous avec Google :</p>
      <a href="/api/auth/google">Connexion Google</a>
    </div>
  );
};

export default Login;
