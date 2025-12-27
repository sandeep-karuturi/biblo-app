import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // 1. Check if user is logged in & Fetch Books
    useEffect(() => {
        // Auth Check
        const user = localStorage.getItem("user");
        if (user) {
            setCurrentUser(JSON.parse(user));
        }

        // Fetch Books from MySQL
        fetch('http://localhost:8081/books')
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.log("Error fetching books:", err));
    }, []);

    // 2. Handle Logout
    const handleLogout = () => {
        localStorage.removeItem("user");
        setCurrentUser(null);
        window.location.reload();
    };

    // 3. Handle Real Swap Request
    const handleSwapRequest = async (book) => {
        if (!currentUser) {
            alert("You must login to swap books!");
            navigate('/login');
            return;
        }

        // Prevent swapping with yourself
        if (currentUser.id === book.owner_id) {
            alert("You cannot swap your own book!");
            return;
        }

        const confirmSwap = window.confirm(`Request to swap "${book.title}" from ${book.owner_name}?`);
        if (!confirmSwap) return;

        try {
            const response = await fetch('http://localhost:8081/swap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    book_id: book.id,
                    owner_id: book.owner_id,
                    requester_id: currentUser.id
                })
            });

            const result = await response.json();
            if (result.Status === "Success") {
                alert("✅ Request Sent! The owner has been notified.");
            } else {
                alert("Failed to send request.");
            }
        } catch (err) {
            console.error(err);
            alert("Server Error");
        }
    };

    // 4. Handle Delete Book
    const handleDelete = async (bookId) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;

        try {
            await fetch(`http://localhost:8081/books/${bookId}`, {
                method: 'DELETE'
            });
            // Remove from screen immediately (Optimistic UI)
            setBooks(books.filter(book => book.id !== bookId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete");
        }
    };

    return (
        <div className="container">
            {/* --- NAVBAR --- */}
            <nav className="navbar">
                <h1 className="logo">Biblo.</h1>
                <div>
                    {currentUser ? (
                        <>
                            {/* UPDATED: Only show first name */}
                            <span style={{ marginRight: '15px', fontWeight: 'bold', color: '#333' }}>
                                Hi, {currentUser.username.split(' ')[0]}
                            </span>

                            <Link to="/add">
                                <button className="login-btn" style={{ marginRight: '10px' }}>+ List Book</button>
                            </Link>
                            <Link to="/swaps">
                                <button className="login-btn" style={{ marginRight: '10px' }}>My Swaps</button>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="login-btn"
                                style={{ borderColor: '#ef4444', color: '#ef4444' }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login">
                            <button className="login-btn">Login</button>
                        </Link>
                    )}
                </div>
            </nav>

            {/* --- HERO / SEARCH --- */}
            <div className="hero-section">
                <h2>Find books near you</h2>
                <input
                    type="text"
                    placeholder="Search title, author, or city..."
                    className="search-box"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* --- BOOK GRID --- */}
            <div className="book-grid">
                {/* Empty State Check */}
                {books.length === 0 && (
                    <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#666' }}>
                        No books found. Be the first to list one!
                    </p>
                )}

                {/* Filter & Map Logic */}
                {books.filter((val) => {
                    if (searchTerm === "") return val;
                    if (val.title.toLowerCase().includes(searchTerm.toLowerCase())) return val;
                    if (val.author.toLowerCase().includes(searchTerm.toLowerCase())) return val;
                    if (val.location.toLowerCase().includes(searchTerm.toLowerCase())) return val;
                    return null;
                }).map((book) => (
                    <div key={book.id} className="book-card">
                        {/* Image Logic */}
                        <div style={{ height: '200px', background: '#f3f4f6', borderRadius: '8px', marginBottom: '15px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {book.cover_pic ? (
                                <img src={book.cover_pic} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <span style={{ color: '#9ca3af', fontSize: '3rem' }}>📖</span>
                            )}
                        </div>

                        <h3>{book.title}</h3>
                        <p className="author">by {book.author}</p>

                        {/* Dynamic Owner Name */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
                            <span>📍 {book.location}</span>
                            <span>👤 {book.owner_name || "Unknown"}</span>
                        </div>

                        {/* --- BUTTONS AREA --- */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {currentUser && currentUser.id === book.owner_id ? (
                                /* 1. DELETE BUTTON (If you are the owner) */
                                <button
                                    onClick={() => handleDelete(book.id)}
                                    className="swap-btn"
                                    style={{ backgroundColor: '#dc2626' }}
                                >
                                    Delete Book
                                </button>
                            ) : (
                                /* 2. SWAP BUTTON (If someone else owns it) */
                                <button
                                    className="swap-btn"
                                    onClick={() => handleSwapRequest(book)}
                                    style={{
                                        backgroundColor: currentUser ? '#2563eb' : '#94a3b8',
                                        cursor: currentUser ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    {currentUser ? "Request Swap" : "Login to Swap"}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;