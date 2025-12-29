import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    // 1. Initialize as empty array to prevent startup crashes
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // 2. Fetch Data Safely
    useEffect(() => {
        // Auth Check
        const user = localStorage.getItem("user");
        if (user) {
            setCurrentUser(JSON.parse(user));
        }

        // Fetch Books
        fetch('https://api.biblo.co.in/books')
            .then(res => res.json())
            .then(data => {
                console.log("API Response:", data); // Check console to see structure!

                // SAFETY CHECK: Ensure we strictly save an Array
                if (Array.isArray(data)) {
                    setBooks(data);
                } else if (data.data && Array.isArray(data.data)) {
                    setBooks(data.data);
                } else if (data.books && Array.isArray(data.books)) {
                    setBooks(data.books);
                } else {
                    console.error("API returned something weird (not an array):", data);
                    setBooks([]); // Fallback to empty list so app doesn't crash
                }
            })
            .catch(err => console.log("Error fetching books:", err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setCurrentUser(null);
        window.location.reload();
    };

    const handleSwapRequest = async (book) => {
        if (!currentUser) {
            alert("You must login to swap books!");
            navigate('/login');
            return;
        }

        if (currentUser.id === book.owner_id) {
            alert("You cannot swap your own book!");
            return;
        }

        const confirmSwap = window.confirm(`Request to swap "${book.title}" from ${book.owner_name}?`);
        if (!confirmSwap) return;

        try {
            const response = await fetch('https://api.biblo.co.in/swap', {
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

    const handleDelete = async (bookId) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;

        try {
            await fetch(`https://api.biblo.co.in/books/${bookId}`, {
                method: 'DELETE'
            });
            // Optimistic UI Update using proper filtering
            setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
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
                {/* 3. SAFETY CHECK: Ensure books exists before checking length */}
                {(!books || books.length === 0) && (
                    <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#666' }}>
                        No books found. Be the first to list one!
                    </p>
                )}

                {/* 4. MAIN FIX: Added '?' optional chaining */}
                {books?.filter((val) => {
                    if (searchTerm === "") return val;
                    if (val.title.toLowerCase().includes(searchTerm.toLowerCase())) return val;
                    if (val.author.toLowerCase().includes(searchTerm.toLowerCase())) return val;
                    if (val.location.toLowerCase().includes(searchTerm.toLowerCase())) return val;
                    return null;
                }).map((book) => (
                    <div key={book.id} className="book-card">
                        <div style={{ height: '200px', background: '#f3f4f6', borderRadius: '8px', marginBottom: '15px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {book.cover_pic ? (
                                <img src={book.cover_pic} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <span style={{ color: '#9ca3af', fontSize: '3rem' }}>📖</span>
                            )}
                        </div>

                        <h3>{book.title}</h3>
                        <p className="author">by {book.author}</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
                            <span>📍 {book.location}</span>
                            <span>👤 {book.owner_name || "Unknown"}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            {currentUser && currentUser.id === book.owner_id ? (
                                <button
                                    onClick={() => handleDelete(book.id)}
                                    className="swap-btn"
                                    style={{ backgroundColor: '#dc2626' }}
                                >
                                    Delete Book
                                </button>
                            ) : (
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