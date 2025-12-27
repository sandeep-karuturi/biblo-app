import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function MySwaps() {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate('/login');
            return;
        }

        // Fetch requests for THIS user
        fetch(`http://172.31.16.9:8081/swaps?user_id=${user.id}`)
            .then(res => res.json())
            .then(data => setRequests(data))
            .catch(err => console.error(err));
    }, [navigate]);

    const handleAction = async (id, status) => {
        try {
            const response = await fetch('http://172.31.16.9:8081/swaps', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });

            const result = await response.json();
            if (result.Status === "Success") {
                alert(`Request ${status}!`);
                window.location.reload(); // Refresh to show new status
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Incoming Requests</h1>
                <Link to="/" style={{ textDecoration: 'none', color: '#2563eb' }}>← Back to Books</Link>
            </div>

            {requests.length === 0 ? <p>No pending requests.</p> : null}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {requests.map(req => (
                    <div key={req.id} style={{
                        padding: '20px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0' }}>{req.title}</h3>
                            <p style={{ margin: 0, color: '#666' }}>
                                Requested by <b>{req.requester_name}</b>
                            </p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>
                                Status: <span style={{
                                    fontWeight: 'bold',
                                    color: req.status === 'Accepted' ? 'green' : (req.status === 'Rejected' ? 'red' : 'orange')
                                }}>{req.status}</span>
                            </p>
                        </div>

                        {req.status === 'Pending' && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => handleAction(req.id, 'Accepted')}
                                    className="swap-btn"
                                    style={{ backgroundColor: '#16a34a', padding: '8px 15px' }}
                                >Accept</button>
                                <button
                                    onClick={() => handleAction(req.id, 'Rejected')}
                                    className="swap-btn"
                                    style={{ backgroundColor: '#dc2626', padding: '8px 15px' }}
                                >Reject</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MySwaps;