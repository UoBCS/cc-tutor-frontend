import axios from 'axios';

const api = {};

axios.defaults.baseURL = 'http://cc-tutor.backend';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token').replace(/"/g, '')

api.signUp = data => {
  return axios.post('/register', data);
};

api.signIn = data => {
  return axios.post('/login', data);
};

api.verifyEmail = token => {
  return axios.get(`/verify-email/${token}`);
};

api.isAuthenticated = token => {
  return axios.get('/authenticated');
};

api.logOut = () => {
  return axios.post('/logout');
};

export default api;
