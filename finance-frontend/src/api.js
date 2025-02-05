import axios from 'axios';

const API_URL = 'http://localhost:8000/finance';

// Create an Axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Index Data API Calls
export const getIndexData = (params = {}) => api.get('/indices/', { params });
export const getIndexById = (id) => api.get(`/indices/${id}/`);
export const createIndexData = (data) => api.post('/indices/', data);
export const updateIndexData = (id, data) => api.put(`/indices/${id}/`, data);
export const deleteIndexData = (id) => api.delete(`/indices/${id}/`);

// Forex Data API Calls
export const getForexData = (params = {}) => api.get('/forex/', { params });
export const getForexById = (id) => api.get(`/forex/${id}/`);
export const createForexData = (data) => api.post('/forex/', data);
export const updateForexData = (id, data) => api.put(`/forex/${id}/`, data);
export const deleteForexData = (id) => api.delete(`/forex/${id}/`);

// Filtering and Sorting
export const filterIndexData = (filters) => api.get('/indices/', { params: filters });
export const filterForexData = (filters) => api.get('/forex/', { params: filters });

// Searching
export const searchIndexData = (query) => api.get('/indices/', { params: { search: query } });
export const searchForexData = (query) => api.get('/forex/', { params: { search: query } });

export const  addIndexData = (data) => api.post('/add_index_ticker/', data);
export const  addForexData = (data) => api.post('/add_forex_pair/', data);

export const getIndexHistory = (ticker, startDate, endDate) => api.get(`/indices/${ticker}/history/`, { params: { start_date: startDate, end_date: endDate } });
export const getForexHistory = (pair) => api.get(`/forex/${pair}/history/`);

export default api;
