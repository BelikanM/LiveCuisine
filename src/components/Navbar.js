import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaUpload, FaComment } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-menu">
          <li className="navbar-item">
            <NavLink
              to="/accueil"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            >
              <FaHome className="navbar-icon" />
              <span>Accueil</span>
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink
              to="/auth"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            >
              <FaUser className="navbar-icon" />
              <span>Auth</span>
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink
              to="/upload"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            >
              <FaUpload className="navbar-icon" />
              <span>Upload</span>
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink
              to="/chat"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            >
              <FaComment className="navbar-icon" />
              <span>Chat</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
