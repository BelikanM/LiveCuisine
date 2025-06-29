import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Accueil from './components/Accueil';
import Auth from './components/Auth';
import Upload from './components/Upload';
import Chat from './components/Chat';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Accueil />} /> {/* Page par défaut */}
      </Routes>
    </Router>
  );
};

export default App;
