import axios from 'axios';

const api = {};

axios.defaults.baseURL = 'http://cc-tutor.backend';

if (localStorage.getItem('access_token')) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token').replace(/"/g, '');
}

api.updateAuthToken = () => {
  if (localStorage.getItem('access_token')) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token').replace(/"/g, '');
    return true;
  }

  return false;
};

api.signUp = data => {
  return axios.post('register', data);
};

api.signIn = data => {
  return axios.post('login', data);
};

api.verifyEmail = token => {
  return axios.get(`verify-email/${token}`);
};

api.getUserData = () => {
  return axios.get('user-data');
};

api.isAuthenticated = token => {
  return axios.get('authenticated');
};

api.logOut = () => {
  return axios.post('logout');
};

api.teacher = {};

api.teacher.getStudents = () => {
  return axios.get('students');
};

api.teacher.sendClassInvitationEmail = emails => {
  return axios.post('teachers/send-class-invitation', { emails });
};

api.student = {};

api.student.getTeachers = () => {
  return axios.get('teachers');
};

api.student.confirmClassInvitation = token => {
  return axios.get(`students/class-invitation/${token}`);
};

api.assignments = {};

api.assignments.getAll = () => {
  return axios.get('assignments?includes[]=teacher');
};

api.assignments.get = id => {
  return axios.get(`assignments/${id}`);
};

api.assignments.create = data => {
  return axios.post('assignments', data);
};

api.assignments.delete = id => {
  return axios.delete(`assignments/${id}`);
};

api.assignments.update = (id, data) => {
  return axios.patch(`assignments/${id}`, data);
};

api.assignments.getSubmissions = id => {
  return axios.get(`assignments/${id}/submissions`);
};

api.assignments.submit = id => {
  return axios.post(`assignments/${id}/submit`);
};

api.assignments.runTests = (assignmentId, studentId) => {
  return axios.post(`assignments/${assignmentId}/students/${studentId}/run-tests`);
};

api.regexToNfa = regex => {
  return axios.get(`algorithms/regex2nfa/${regex}`);
};

api.nfaToDfa = data => {
  return axios.post('algorithms/nfa2dfa', data);
}

api.cekMachineRun = content => {
  const data = {
    control: content,
    environment: [],
    continuation: []
  };

  return axios.post(`/algorithms/cek-machine/run`, { cek_machine: data });
}

api.lexicalAnalysis = data => {
  return axios.post('phases/lexical-analysis', data);
};

api.ll = {};

api.ll.initParser = data => {
  return axios.post('phases/syntax-analysis/ll/init-parser', {
    ndp_run: data
  });
};

api.ll.deleteRun = id => {
  return axios.delete(`phases/syntax-analysis/ll/${id}`);
};

api.ll.match = data => {
  return axios.post('phases/syntax-analysis/ll/match', data);
};

api.ll.predict = data => {
  return axios.post('phases/syntax-analysis/ll/predict', data);
};

api.ll1 = {};

api.ll1.parse = data => {
  return axios.post('phases/syntax-analysis/ll1/parse', data);
}

api.lr = {};

api.lr.initParser = data => {
  return axios.post('phases/syntax-analysis/lr/init-parser', {
    ndp_run: data
  });
};

api.lr.deleteRun = id => {
  return axios.delete(`phases/syntax-analysis/lr/${id}`);
};

api.lr.shift = data => {
  return axios.post('phases/syntax-analysis/lr/shift', data);
};

api.lr.reduce = data => {
  return axios.post('phases/syntax-analysis/lr/reduce', data);
};

api.lr0 = {};

api.lr0.parse = data => {
  return axios.post('phases/syntax-analysis/lr0/parse', data);
};

api.semanticAnalysis = {};

api.semanticAnalysis.ast = (data, files, type = 'parsing') => {
  let _data = Object.assign({}, data, { files }, { input_type: type });
  return axios.post('phases/semantic-analysis/ast', _data);
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
