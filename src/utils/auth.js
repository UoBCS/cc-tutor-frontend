import api from 'api';
import storage from 'utils/storage';

const auth = {};

auth.isAuthenticated = () => {
  return api.isAuthenticated(localStorage.getItem('access_token'));
};

auth.getUserData = () => {
  const userData = storage.get('user_data');

  return !userData
    ? api.getUserData()
    : new Promise((resolve, _) => resolve(userData));
};

auth.updateUserData = () => {
  auth.getUserData()
    .then(res => {
      storage.set('user_data', res.data ? res.data : res);
    })
    .catch(err => {});
};

export default auth;
