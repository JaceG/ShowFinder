import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="navigation">
            <Link 
                to="/" 
                className="nav-brand" 
                style={{ 
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: 'inherit'
                }}
            >
                Event App
            </Link>
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/saved-events">My Saved Events</Link>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="login-btn">Login</Link>
                        <Link to="/signup" className="signup-btn">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation;