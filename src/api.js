import axios from 'axios';

const api = {};

axios.defaults.baseURL = 'http://cc-tutor.backend';

api.signUp = data => {
  return axios.post('/register', data);
};

api.signIn = data => {
  return axios.post('/login', data);
};

api.verifyEmail = token => {
  return axios.get(`/verify-email/${token}`);
};

export default api;
