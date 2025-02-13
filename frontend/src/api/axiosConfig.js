import axios from 'axios';

const api = axios.create({
	baseURL:
		process.env.NODE_ENV === 'production'
			? '/api' // In production, use relative path
			: 'http://localhost:3333/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add request interceptor for error handling
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor for error handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error('API Error:', error.response);
		return Promise.reject(error);
	}
);

export default api;
