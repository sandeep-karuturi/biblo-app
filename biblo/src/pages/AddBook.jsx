import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AddBook() {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        location: '',
        cover_pic: ''
    });
    const navigate = useNavigate();

    // Redirect if not logged in
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            alert("You must be logged in to list a book!");
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get current user ID from memory
        const user = JSON.parse(localStorage.getItem("user"));

        try {
            const response = await fetch('http://172.31.16.9:8081/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    author: formData.author,
                    location: formData.location,
                    cover_pic: formData.cover_pic,
                    owner_id: user ? user.id : 1 // Use Real ID or fallback to 1
                })
            });

            if (response.ok) {
                alert("Book added successfully!");
                navigate('/'); // Go back to Home to see the new book
            } else {
                alert("Failed to add book.");
            }

        } catch (err) {
            console.error(err);
            alert("Error connecting to server.");
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '40px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#666' }}>← Back to Home</Link>

            <h1 style={{ marginTop: '10px' }}>List a Book</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Book Title</label>
                    <input
                        type="text" name="title"
                        className="search-box" style={{ borderRadius: '8px' }}
                        onChange={handleChange} required
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Author</label>
                    <input
                        type="text" name="author"
                        className="search-box" style={{ borderRadius: '8px' }}
                        onChange={handleChange} required
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Cover Image URL</label>
                    <input
                        type="text"
                        name="cover_pic"
                        placeholder="Paste link from Google Images"
                        className="search-box"
                        style={{ borderRadius: '8px' }}
                        onChange={handleChange}
                    />
                    {/* Visual Helper: Show preview if link is pasted */}
                    {formData.cover_pic && (
                        <img src={formData.cover_pic} alt="Preview" style={{ height: '100px', marginTop: '10px' }} />
                    )}
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Your City</label>
                    <input
                        type="text" name="location"
                        className="search-box" style={{ borderRadius: '8px' }}
                        onChange={handleChange} required
                    />
                </div>

                <button type="submit" className="swap-btn" style={{ marginTop: '10px' }}>
                    Add Book to Library
                </button>
            </form>
        </div>
    );
}

export default AddBook;