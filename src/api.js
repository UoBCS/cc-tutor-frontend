import axios from 'axios';

const api = {};

axios.defaults.baseURL = 'http://cc-tutor.backend';
if (localStorage.getItem('access_token')) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token').replace(/"/g, '');
}

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

api.regexToNfa = regex => {
  return axios.get(`/algorithms/regex2nfa/${regex}`);
};

api.nfaToDfa = data => {
  return axios.post('/algorithms/nfa2dfa', data);
}

api.lexicalAnalysis = data => {
  return axios.post('/phases/lexical-analysis', data);
};

api.ll = {};

api.ll.initParser = data => {
  return axios.post('/phases/syntax-analysis/ll/init-parser', {
    ll_run: data
  });
};

api.ll.deleteRun = id => {
  return axios.delete(`/phases/syntax-analysis/ll/${id}`);
};

api.ll.match = data => {
  return axios.post('/phases/syntax-analysis/ll/match', data);
};

api.ll.predict = data => {
  return axios.post('/phases/syntax-analysis/ll/predict', data);
};

export default api;
