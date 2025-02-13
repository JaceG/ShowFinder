import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useTheme } from '../context/ThemeContext';

const Navigation = () => {
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem('user'));
	const { toggleColorMode } = useTheme();

	return (
		<nav className='navigation'>
			<div className='nav-left'>
				<Link
					to='/'
					className='nav-brand'
					style={{
						cursor: 'pointer',
						textDecoration: 'none',
						color: '#333',
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
					}}>
					<img
						src='/logo512.png'
						alt='ShowFinder Logo'
						style={{
							width: '32px',
							height: '32px',
						}}
					/>
					ShowFinder
				</Link>
			</div>

			<div className='nav-center'>
				<IconButton onClick={toggleColorMode} sx={{ color: '#333' }}>
					<Brightness4Icon />
				</IconButton>
			</div>

			<div className='nav-right'>
				{user ? (
					<>
						<Link to='/saved-events'>Saved Events</Link>
						<button
							onClick={() => {
								localStorage.removeItem('token');
								localStorage.removeItem('user');
								navigate('/');
							}}
							className='logout-btn'>
							Logout
						</button>
					</>
				) : (
					<>
						<Link to='/login' className='login-btn'>
							Login
						</Link>
						<Link to='/signup' className='signup-btn'>
							Sign Up
						</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navigation;
