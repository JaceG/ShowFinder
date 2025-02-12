import { createTheme } from '@mui/material';

export const getTheme = (mode) =>
	createTheme({
		typography: {
			fontFamily: 'Arial, sans-serif',
		},
		palette: {
			mode,
			primary: {
				main: '#4BA3ECFF',
			},
			...(mode === 'light'
				? {
						// Light mode colors
						background: {
							default: '#ffffff',
							paper: '#f5f5f5',
						},
						text: {
							primary: '#000000',
							secondary: 'rgba(0, 0, 0, 0.7)',
						},
						divider: 'rgba(0, 0, 0, 0.12)',
						action: {
							hover: 'rgba(0, 0, 0, 0.04)',
							selected: 'rgba(0, 0, 0, 0.08)',
						},
				  }
				: {
						// Dark mode colors
						background: {
							default: '#121212',
							paper: '#1e1e1e',
						},
						text: {
							primary: '#ffffff',
							secondary: 'rgba(255, 255, 255, 0.7)',
						},
						divider: 'rgba(255, 255, 255, 0.12)',
						action: {
							hover: 'rgba(255, 255, 255, 0.04)',
							selected: 'rgba(255, 255, 255, 0.08)',
						},
				  }),
		},
		components: {
			MuiCard: {
				styleOverrides: {
					root: ({ theme }) => ({
						backgroundColor: theme.palette.background.paper,
					}),
				},
			},
			MuiAppBar: {
				styleOverrides: {
					root: ({ theme }) => ({
						backgroundColor: theme.palette.background.paper,
						color: theme.palette.text.primary,
					}),
				},
			},
			MuiTextField: {
				styleOverrides: {
					root: ({ theme }) => ({
						'& .MuiOutlinedInput-root': {
							backgroundColor: theme.palette.background.paper,
						},
					}),
				},
			},
			MuiCssBaseline: {
				styleOverrides: {
					'@font-face': 'none',
					body: {
						fontFamily: 'Arial, sans-serif',
					},
				},
			},
		},
	});
