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

api.getUserData = () => {
  return axios.get('/user-data');
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
    ndp_run: data
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

api.ll1 = {};

api.ll1.parse = data => {
  return axios.post('/phases/syntax-analysis/ll1/parse', data);
}

api.lr = {};

api.lr.initParser = data => {
  return axios.post('/phases/syntax-analysis/lr/init-parser', {
    ndp_run: data
  });
};

api.lr.deleteRun = id => {
  return axios.delete(`/phases/syntax-analysis/lr/${id}`);
};

api.lr.shift = data => {
  return axios.post('/phases/syntax-analysis/lr/shift', data);
};

api.lr.reduce = data => {
  return axios.post('/phases/syntax-analysis/lr/reduce', data);
};

api.lr0 = {};

api.lr0.parse = data => {
  return axios.post('phases/syntax-analysis/lr0/parse', data);
};

api.cca = {};

api.cca.getCourses = () => {
  return axios.get('cca/courses');
};

api.cca.subscribeToCourse = courseId => {
  return axios.post(`cca/courses/${courseId}/subscribe`);
};

api.cca.unsubscribeFromCourse = courseId => {
  return axios.post(`cca/courses/${courseId}/unsubscribe`);
}

api.cca.getLessons = courseId => {
  return axios.get(`cca/courses/${courseId}/lessons`);
};

api.cca.getLesson = (courseId, lessonId) => {
  return axios.get(`cca/courses/${courseId}/lessons/${lessonId}`);
};

api.cca.getCurrentLesson = courseId => {
  return axios.get(`cca/courses/${courseId}/current-lesson`);
};

api.cca.submitLesson = (courseId, lessonId, data) => {
  return axios.post(`cca/courses/${courseId}/lessons/${lessonId}/submit`, data);
};

export default api;
