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

api.signUp = data => axios.post('register', data);

api.signIn = data => axios.post('login', data);

api.verifyEmail = token => axios.get(`verify-email/${token}`);

api.getUserData = () => axios.get('user-data');

api.isAuthenticated = token => axios.get('authenticated');

api.logOut = () => axios.post('logout');

api.teacher = {};

api.teacher.getStudents = () => axios.get('students');

api.teacher.sendClassInvitationEmail = emails => axios.post('teachers/send-class-invitation', { emails });

api.student = {};

api.student.getTeachers = () => axios.get('teachers');

api.student.confirmClassInvitation = token => axios.get(`students/class-invitation/${token}`);

api.assignments = {};

api.assignments.getAll = () => axios.get('assignments?includes[]=teacher');

api.assignments.get = id => axios.get(`assignments/${id}`);

api.assignments.create = data => axios.post('assignments', data);

api.assignments.delete = id => axios.delete(`assignments/${id}`);

api.assignments.update = (id, data) => axios.patch(`assignments/${id}`, data);

api.assignments.getSubmissions = id => axios.get(`assignments/${id}/submissions`);

api.assignments.submit = id => axios.post(`assignments/${id}/submit`);

api.assignments.runTests = (assignmentId, studentId) => axios.post(`assignments/${assignmentId}/students/${studentId}/run-tests`);

api.regexToNfa = regex => axios.get(`algorithms/regex2nfa/${regex}`);

api.nfaToDfa = data => axios.post('algorithms/nfa2dfa', data);

api.minimizeDfa = data => axios.post('algorithms/minimize-dfa', data);

api.cekMachineRun = content => axios.post(`/algorithms/cek-machine/run`, { cek_machine: { control: content, environment: [], continuation: [] } });

api.lexicalAnalysis = data => axios.post('phases/lexical-analysis', data);

api.ll = {};

api.ll.initParser = data => axios.post('phases/syntax-analysis/ll/init-parser', { ndp_run: data });

api.ll.deleteRun = id => axios.delete(`phases/syntax-analysis/ll/${id}`);

api.ll.match = data => axios.post('phases/syntax-analysis/ll/match', data);

api.ll.predict = data => axios.post('phases/syntax-analysis/ll/predict', data);

api.ll1 = {};

api.ll1.parse = data => axios.post('phases/syntax-analysis/ll1/parse', data);

api.lr = {};

api.lr.initParser = data => axios.post('phases/syntax-analysis/lr/init-parser', { ndp_run: data });

api.lr.deleteRun = id => axios.delete(`phases/syntax-analysis/lr/${id}`);

api.lr.shift = data => axios.post('phases/syntax-analysis/lr/shift', data);

api.lr.reduce = data => axios.post('phases/syntax-analysis/lr/reduce', data);

api.lr0 = {};

api.lr0.parse = data => axios.post('phases/syntax-analysis/lr0/parse', data);

api.semanticAnalysis = {};

api.semanticAnalysis.ast = (data, files, type = 'parsing') => {
  let _data = Object.assign({}, data, { files }, { input_type: type });
  return axios.post('phases/semantic-analysis/ast', _data);
};

api.cca = {};

api.cca.getCourses = () => axios.get('cca/courses');

api.cca.subscribeToCourse = courseId => axios.post(`cca/courses/${courseId}/subscribe`);

api.cca.unsubscribeFromCourse = courseId => axios.post(`cca/courses/${courseId}/unsubscribe`);

api.cca.getLessons = courseId => axios.get(`cca/courses/${courseId}/lessons`);

api.cca.getLesson = (courseId, lessonId) => axios.get(`cca/courses/${courseId}/lessons/${lessonId}`);

api.cca.getCurrentLesson = courseId => axios.get(`cca/courses/${courseId}/current-lesson`);

api.cca.submitLesson = (courseId, lessonId, data) => axios.post(`cca/courses/${courseId}/lessons/${lessonId}/submit`, data);

export default api;
