import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MySwaps from './pages/MySwaps';
import Register from './pages/Register';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AddBook from './pages/AddBook'; // <--- NEW IMPORT
import About from './pages/About';
import Help from './pages/Help';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="add" element={<AddBook />} /> {/* <--- NEW ROUTE */}
            <Route path="/swaps" element={<MySwaps />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </div>
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} Biblo. All rights reserved.</p>
            </div>
            <div className="space-x-4">
              <Link to="/about" className="hover:text-gray-300">About</Link>
              <Link to="/help" className="hover:text-gray-300">Help</Link>

            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );


}

export default App;