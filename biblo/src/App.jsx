import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MySwaps from './pages/MySwaps';
import Register from './pages/Register';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AddBook from './pages/AddBook'; // <--- NEW IMPORT

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="add" element={<AddBook />} /> {/* <--- NEW ROUTE */}
        <Route path="/swaps" element={<MySwaps />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;