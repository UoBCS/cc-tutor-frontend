import shortid from 'shortid';
import automata from 'utils/automata';
import ui from 'utils/ui';
import misc from 'utils/misc';

const userInteraction = {};

userInteraction.nfa = {};

userInteraction.nfa.getters = {
  nodes: [],
  edges: []
};

userInteraction.dfa = {};

userInteraction.dfa.adders = {
  nodes: [],
  edges: []
};

userInteraction.dfa.getters = {
  nodes: [],
  edges: []
};

userInteraction.dfa.addNode = function (data, cb) {
  data.id = shortid.generate();
  data.label = '';
  userInteraction.dfa.adders.nodes.push(data.id);
  cb(data);
};

userInteraction.dfa.addEdge = function (data, cb) {
  data.arrows = 'to';
  data.label = prompt('Please enter the transition character:', 'ε');
  data.font = {align: 'top'};
  data.id = `${data.from}-${data.label}-${data.to}`;

  userInteraction.dfa.adders.edges.push({
    id: data.id,
    from: data.from,
    to: data.to,
    label: data.label,
    new: !automata.isConnected(this.state.nfa, data.from)
      && !automata.isConnected(this.state.nfa, data.to)
  });

  if (data.from === data.to) {
    if (window.confirm('Do you want to connect the state to itself?')) {
      cb(data);
    }
  }
  else {
    cb(data);
  }
};


userInteraction.checkAnswer = function () {

};

userInteraction.accept = function () {

};

userInteraction.refuse = function () {

};

export default userInteraction;
