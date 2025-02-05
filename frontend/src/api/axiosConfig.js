import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3333/api', // or whatever port your backend is running on
});

export default api; 