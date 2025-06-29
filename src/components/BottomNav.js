import React from "react";
import { NavLink } from "react-router-dom";
import { AiFillHome, AiFillVideoCamera, AiOutlinePlusCircle, AiOutlineUser } from "react-icons/ai";

function BottomNav() {
  const navStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60px",
    background: "#fff",
    borderTop: "1px solid #ccc",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 1000,
  };

  const linkStyle = {
    color: "#555",
    textDecoration: "none",
    fontSize: "22px",
  };

  const activeStyle = {
    color: "#25D366",
  };

  return React.createElement(
    "nav",
    { style: navStyle },
    React.createElement(NavLink, { to: "/", style: linkStyle }, React.createElement(AiFillHome)),
    React.createElement(NavLink, { to: "/videos", style: linkStyle }, React.createElement(AiFillVideoCamera)),
    React.createElement(NavLink, { to: "/add", style: linkStyle }, React.createElement(AiOutlinePlusCircle)),
    React.createElement(NavLink, { to: "/profile", style: linkStyle }, React.createElement(AiOutlineUser))
  );
}

export default BottomNav;
