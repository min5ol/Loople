import axios from 'axios';

const token = localStorage.getItem('accessToken');

const instance = axios.create({
  baseURL: 'http://localhost:8080/api/v2',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});


export default instance;