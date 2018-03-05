import shortid from 'shortid';
import automata from 'utils/automata';
import ui from 'utils/ui';

const userInteraction = {};

userInteraction.nfa = {};

userInteraction.nfa.adders = {
  nodes: [],
  edges: []
};

userInteraction.nfa.getters = {
  nodes: [],
  edges: []
};

userInteraction.nfa.addNode = function (data, cb) {
  data.id = shortid.generate();
  data.label = '';
  userInteraction.nfa.adders.nodes.push(data.id);
  cb(data);
};

userInteraction.nfa.addEdge = function (data, cb) {
  data.id = `${data.from}-${data.to}`;
  data.arrows = 'to';
  data.label = prompt('Please enter the transition character:', 'ε');
  data.font = {align: 'top'};

  userInteraction.nfa.adders.edges.push({
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
  const breakpoint = this.state.breakpoint.data[this.state.breakpoint.index + 1];
  const { adders, getters } = userInteraction.nfa;
  let valid;

  if (breakpoint === undefined) {
    // FIXME: fix this

    return;
  }

  if (breakpoint.label === 's') {
    valid = adders.edges.length
        && adders.edges[0].from === breakpoint.data.entry.id
        && adders.edges[0].to === breakpoint.data.exit.id
        && adders.edges[0].label === breakpoint.data.transition;
  } else if (breakpoint.label === 'c' || breakpoint.label === 'e') {
    valid = adders.edges.length
        && adders.edges[0].label === breakpoint.data.transition
        && adders.edges[0].new;
  } else if (breakpoint.label === 'rep') {
    let entry = breakpoint.data.state1;
    let exit = breakpoint.data.state2;

    valid = adders.edges.length === 2 && (
        (adders.edges[0].from === entry.id && adders.edges[0].to === exit.id && adders.edges[1].from === exit.id && adders.edges[1].to === entry.id) ||
        (adders.edges[0].from === exit.id && adders.edges[0].to === entry.id && adders.edges[1].from === entry.id && adders.edges[1].to === exit.id)
      );
  } else if (breakpoint.label === 'or1') {
    valid = adders.nodes.length === 1 && adders.edges.length === 0;
  } else if (breakpoint.label === 'or2') {
    //valid =
  }

  if (valid) {
    userInteraction.accept.call(this);
  } else {
    userInteraction.refuse.call(this);
  }
};

userInteraction.accept = function () {
  const { adders, getters } = userInteraction.nfa;

  ui.obj.modal.show(this, null, 'Correct answer!', null, 'mini');

  automata.removeNodes(this.state.nfa, adders.nodes);
  this.refs.visualizationControl.eventHandlers.forward();
};

userInteraction.refuse = function () {
  const { adders, getters } = userInteraction.nfa;

  ui.obj.modal.show(this, null, 'Wrong answer! Please retry.', null, 'mini');
  automata.removeNodes(this.state.nfa, adders.nodes);
};

export default userInteraction;
