import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Videos from "./pages/Videos";
import AddVideo from "./pages/AddVideo";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";

function App() {
  return React.createElement(
    Router,
    null,
    React.createElement(
      "div",
      { style: { paddingBottom: "60px" } },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: "/", element: React.createElement(Home) }),
        React.createElement(Route, { path: "/videos", element: React.createElement(Videos) }),
        React.createElement(Route, { path: "/add", element: React.createElement(AddVideo) }),
        React.createElement(Route, { path: "/profile", element: React.createElement(Profile) })
      ),
      React.createElement(BottomNav)
    )
  );
}

export default App;
