import React from "react";
import { NavLink } from "react-router-dom";
import { AiFillHome, AiOutlineUser, AiOutlinePlusCircle, AiFillFire, AiOutlineClockCircle } from "react-icons/ai";
import "./BottomNav.css";

function BottomNav() {
  return (
    <div className="bottom-nav">
      <NavLink to="/" className="nav-item">
        <AiFillHome size={24} />
        <span>Accueil</span>
      </NavLink>
      <NavLink to="/trending" className="nav-item">
        <AiFillFire size={24} />
        <span>Populaire</span>
      </NavLink>
      <NavLink to="/add" className="nav-item add-btn">
        <AiOutlinePlusCircle size={36} />
      </NavLink>
      <NavLink to="/latest" className="nav-item">
        <AiOutlineClockCircle size={24} />
        <span>Récent</span>
      </NavLink>
      <NavLink to="/profile" className="nav-item">
        <AiOutlineUser size={24} />
        <span>Profil</span>
      </NavLink>
    </div>
  );
}

export default BottomNav;
