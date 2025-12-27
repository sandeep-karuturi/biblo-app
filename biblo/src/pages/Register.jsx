import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        city: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://api.biblo.co.in/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.Status === "Success") {
                alert("Account Created! Please Login.");
                navigate('/login');
            } else {
                alert("Registration Failed. Email might be taken.");
            }
        } catch (err) {
            console.error(err);
            alert("Server Error");
        }
    };

    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Join Biblo</h1>
            <p style={{ color: '#666' }}>Start swapping books today</p>

            <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: '20px auto' }}>
                <input
                    type="text" name="username" placeholder="Full Name"
                    className="search-box" style={{ marginBottom: '10px' }}
                    onChange={handleChange} required
                />
                <input
                    type="email" name="email" placeholder="Email Address"
                    className="search-box" style={{ marginBottom: '10px' }}
                    onChange={handleChange} required
                />
                <input
                    type="password" name="password" placeholder="Password"
                    className="search-box" style={{ marginBottom: '10px' }}
                    onChange={handleChange} required
                />
                <input
                    type="text" name="city" placeholder="Your City"
                    className="search-box" style={{ marginBottom: '15px' }}
                    onChange={handleChange} required
                />

                <button type="submit" className="swap-btn" style={{ width: '100%' }}>Create Account</button>
            </form>

            <p style={{ marginTop: '20px' }}>
                Already have an account? <Link to="/login" style={{ color: '#2563eb' }}>Login here</Link>
            </p>
        </div>
    );
}

export default Register;