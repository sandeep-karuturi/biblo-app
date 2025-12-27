import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import MySwaps from './pages/MySwaps';
import Register from './pages/Register';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AddBook from './pages/AddBook';
import About from './pages/About';
import Help from './pages/Help';
// You likely need these if you created the files, otherwise comment them out:

function App() {
  return (
    <BrowserRouter>
      {/* 1. Main Wrapper for Sticky Footer */}
      <div className="app-wrapper">

        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add" element={<AddBook />} />
            <Route path="/swaps" element={<MySwaps />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </div>

        {/* 2. The Footer (Now using standard classes) */}
        <footer className="biblo-footer">
          <div className="footer-container">
            <div>
              <p>&copy; {new Date().getFullYear()} Biblo. All rights reserved.</p>
            </div>
            <div className="footer-links">
              <Link to="/about" className="footer-link">About</Link>
              <Link to="/help" className="footer-link">Help</Link>
            </div>
          </div>
        </footer>

      </div>
    </BrowserRouter>
  );
}

export default App;