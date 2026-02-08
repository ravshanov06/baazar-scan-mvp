import axios from 'axios';

// Use environment variable for API URL in production, fallback to proxy in development
const API_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
