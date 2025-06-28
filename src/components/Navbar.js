// src/components/Navbar.js
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaFire, FaUser, FaVideo, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Simuler l'état de connexion (remplacer par une vraie logique d'authentification)
  const isAuthenticated = true; // À connecter au backend pour vérifier le token JWT

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Logique de déconnexion (supprimer le token, etc.)
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Platstream</h1>
      </div>
      <button className="hamburger" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={() => setIsOpen(false)}
          >
            <FaHome className="nav-icon" /> Accueil
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/trending"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={() => setIsOpen(false)}
          >
            <FaFire className="nav-icon" /> Tendances
          </NavLink>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={() => setIsOpen(false)}
              >
                <FaUser className="nav-icon" /> Profil
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/upload"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={() => setIsOpen(false)}
              >
                <FaVideo className="nav-icon" /> Upload
              </NavLink>
            </li>
            <li>
              <button className="nav-link logout" onClick={handleLogout}>
                <FaSignInAlt className="nav-icon" /> Déconnexion
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={() => setIsOpen(false)}
            >
              <FaSignInAlt className="nav-icon" /> Connexion
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
