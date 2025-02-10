import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles'; // import useTheme from MUI
import './Navigation.css';

const Navigation = () => {
    const navigate = useNavigate();
    const theme = useTheme(); // get the current theme
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // Use theme values for background and text color
    const navStyle = {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    return (
        <nav className="navigation" style={navStyle}>
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