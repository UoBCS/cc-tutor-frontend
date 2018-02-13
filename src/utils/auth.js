import api from 'api';

const auth = {};

auth.isAuthenticated = () => {
  return api.isAuthenticated(localStorage.getItem('access_token'));
};

auth.getUserData = () => {
  return api.getUserData();
};

export default auth;
