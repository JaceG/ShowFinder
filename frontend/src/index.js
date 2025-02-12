import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<ThemeProvider>
				<CssBaseline enableColorScheme />
				<App />
			</ThemeProvider>
		</StyledEngineProvider>
	</React.StrictMode>
);

reportWebVitals();
