import api from 'api';

const auth = {};

auth.isAuthenticated = () => {
  return api.isAuthenticated(localStorage.getItem('access_token'));
};

export default auth;
