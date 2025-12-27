import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Send request to your Node.js backend
            const response = await fetch('https://api.biblo.co.in/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.Status === "Success") {
                // SUCCESS: Save user data and go Home
                localStorage.setItem("user", JSON.stringify(result.user));
                navigate('/');
            } else {
                // FAIL: Show error message
                alert(result.Message || "Login Failed");
            }

        } catch (err) {
            console.error("Login Error:", err);
            alert("Server error. Is the backend running?");
        }
    };

    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome Back</h1>
            <p style={{ color: '#666' }}>Login to swap books</p>

            <form onSubmit={handleLogin} style={{ maxWidth: '300px', margin: '20px auto' }}>
                <input
                    type="email"
                    placeholder="Email"
                    className="search-box"
                    style={{ marginBottom: '15px' }}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="search-box"
                    style={{ marginBottom: '15px' }}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="swap-btn">Login</button>
            </form>

            <p style={{ fontSize: '0.9rem', color: '#888' }}>

            </p>
            <p style={{ marginTop: '20px' }}>
                New to Biblo? <Link to="/register" style={{ color: '#2563eb' }}>Create an Account</Link>
            </p>
            <Link to="/" style={{ textDecoration: 'none', color: '#2563eb' }}>← Back to Home</Link>
        </div>
    );
}

export default Login;