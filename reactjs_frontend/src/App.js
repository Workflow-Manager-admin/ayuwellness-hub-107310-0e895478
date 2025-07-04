import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import './App.css';

// Import feature page components
import Home from './components/Home';
import Remedies from './components/Remedies';
import DoshaQuiz from './components/DoshaQuiz';
import Articles from './components/Articles';
import Contact from './components/Contact';
import SymptomChecker from './components/SymptomChecker';
import AyuBotChat from './components/AyuBotChat';
import HerbExplorer from './components/HerbExplorer';
// Herbal styled navigation bar
function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setNavOpen(false); // auto-close on route change
  }, [location]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span role="img" aria-label="herb" style={{marginRight: 6}}>🌿</span>
        <span className="ayu-title">AyuCare</span>
      </div>
      <button className="navbar-toggle" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle navigation">
        ☰
      </button>
      <div className={`navbar-links${navOpen ? " open" : ""}`}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/remedies">Remedies</NavLink>
        <NavLink to="/herbs">Herb Explorer</NavLink>
        <NavLink to="/quiz">Dosha Quiz</NavLink>
        <NavLink to="/symptom-checker">Symptom Checker</NavLink>
        <NavLink to="/ayubot">Ask AyuBot</NavLink>
        <NavLink to="/articles">Articles</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Stays for possible theme toggle extension
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <Router>
      <div className="App ayu-bg">
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <Navbar />
        <main className='ayu-main'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/remedies" element={<Remedies />} />
            <Route path="/herbs" element={<HerbExplorer />} />
            <Route path="/quiz" element={<DoshaQuiz />} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/ayubot" element={<AyuBotChat />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
