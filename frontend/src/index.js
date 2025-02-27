import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import Hotjar from '@hotjar/browser';

// Initialize Hotjar
const siteId = 5320792;
const hotjarVersion = 6;
Hotjar.init(siteId, hotjarVersion);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<ThemeProvider>
				<CssBaseline />
				<App />
			</ThemeProvider>
		</StyledEngineProvider>
	</React.StrictMode>
);
