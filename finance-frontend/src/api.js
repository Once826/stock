import axios from 'axios';

const API_URL = 'http://localhost:8000/finance';

export const getAllIndexData = (params) => {
  return axios.get(`${API_URL}/indices/`, { params });
};

export const getAllForexData = (params) => {
  return axios.get(`${API_URL}/forex/`, { params });
};

export const searchInIndexData = (query) => {
  return axios.get(`${API_URL}/indices/search/`, { params: { query } });
};

export const searchInForexData = (query) => {
  return axios.get(`${API_URL}/forex/search/`, { params: { query } });
}