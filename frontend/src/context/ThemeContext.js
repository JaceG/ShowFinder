import React, { createContext, useState, useContext, useMemo } from 'react';
import {
	ThemeProvider as MuiThemeProvider,
	useMediaQuery,
} from '@mui/material';
import { getTheme } from '../theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

	const toggleColorMode = () => {
		setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
	};

	const theme = useMemo(() => getTheme(mode), [mode]);

	return (
		<ThemeContext.Provider value={{ mode, toggleColorMode }}>
			<MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
		</ThemeContext.Provider>
	);
}

export const useTheme = () => useContext(ThemeContext);
