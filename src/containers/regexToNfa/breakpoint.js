import automata from 'utils/automata';
import _ from 'lodash';
import clone from 'clone';
import ui from 'utils/ui';

export const breakpoint = {};

/**
 * Utils
 */

breakpoint.utils = {};

breakpoint.utils.map = {
  e: automata.EPSILON,
  c: 'character',
  s: 'sequence (through epsilon)',
  rep: 'repetition (through epsilon)',
  or1: ''
};

/**
 * Forward
 */

breakpoint.forward = {};

breakpoint.forward.e = function ({data, index, label}) {
  automata.addEdge(this.state.nfa, data.entry, data.exit, data.transition);

  const str = `Add ${breakpoint.utils.map[label]} transition from state ${data.entry.id} to state ${data.exit.id}`;

  ui.obj.toast.show(str);

  this.refs.actionsHistory.addOrSelect(index, {
    title: str,
    breakpoint: data
  });
};

breakpoint.forward.c = breakpoint.forward.e;

breakpoint.forward.s = breakpoint.forward.e;

breakpoint.forward.rep = function ({data, index, label}) {
  automata.addEdge(this.state.nfa, data.state1, data.state2, automata.EPSILON);
  automata.addEdge(this.state.nfa, data.state2, data.state1, automata.EPSILON);

  const str = `Add ${breakpoint.utils.map[label]} transitions between states ${data.state1} and ${data.state2} to form repetition`;

  ui.obj.toast.show(str);

  this.refs.actionsHistory.addOrSelect(index, {
    title: str,
    breakpoint: data
  });
};

breakpoint.forward.or1 = function ({data, index}) {
  automata.addNode(this.state.nfa, data.entry);

  const str = `Add entry choice state ${data.entry.id}`;

  ui.obj.toast.show(str);

  this.refs.actionsHistory.addOrSelect(index, {
    title: str,
    breakpoint: data
  });
};

breakpoint.forward.or2 = function ({data, index}) {
  automata.addEdge(this.state.nfa, data.entry, data.choices[0], automata.EPSILON);
  automata.addEdge(this.state.nfa, data.entry, data.choices[1], automata.EPSILON);

  const str =`Add ${automata.EPSILON}-transitions to choice states ${data.choices[0].id} and ${data.choices[1].id} from entry state ${data.entry.id}`;

  ui.obj.toast.show(str);

  this.refs.actionsHistory.addOrSelect(index, {
    title: str,
    breakpoint: data
  });
};

breakpoint.forward.or3 = function ({data, index}) {
  automata.addNode(this.state.nfa, data.exit);

  const str = `Add exit choice state ${data.exit.id}`;

  ui.obj.toast.show(str);

  this.refs.actionsHistory.addOrSelect(index, {
    title: str,
    breakpoint: data
  });
};

breakpoint.forward.or4 = function ({data, index}) {
  automata.addEdge(this.state.nfa, data.choices[0], data.exit, automata.EPSILON);
  automata.addEdge(this.state.nfa, data.choices[1], data.exit, automata.EPSILON);

  const str = `Add ${automata.EPSILON}-transitions from choice states ${data.choices[0].id} and ${data.choices[1].id} to exit state ${data.exit.id}`;

  ui.obj.toast.show(str);

  this.refs.actionsHistory.addOrSelect(index, {
    title: str,
    breakpoint: data
  });
};

breakpoint.commit = function (cb = null) {
  let visualizationStates = this.state.visualizationStates || [];

  let state = {
    nfa: {
      nodes: clone(this.state.nfa.nodes),
      edges: clone(this.state.nfa.edges)
    }
  };

  if (this.state.regexTree) {
    state.regexTree = {
      nodes: clone(this.state.regexTree.nodes),
      edges: clone(this.state.regexTree.edges)
    };
  }

  visualizationStates.push(state);

  this.setState({ visualizationStates }, cb);
};

breakpoint.rollback = function () {
  let visualizationStates = this.state.visualizationStates || [];

  let visualizationState = visualizationStates.pop();

  let state = { visualizationStates };

  const nfaNodes = clone(visualizationState.nfa.nodes);
  const nfaEdges = clone(visualizationState.nfa.edges);

  this.state.nfa.instance.setData({
    nodes: nfaNodes,
    edges: nfaEdges
  });

  state.nfa = {
    instance: this.state.nfa.instance,
    nodes: nfaNodes,
    edges: nfaEdges
  };

  let regexTreeNodes;
  let regexTreeEdges;

  if (this.state.regexTree && visualizationState.regexTree) {
    regexTreeNodes = clone(visualizationState.regexTree.nodes);
    regexTreeEdges = clone(visualizationState.regexTree.edges);

    this.state.regexTree.instance.setData({
      nodes: regexTreeNodes,
      edges: regexTreeEdges
    });

    state.regexTree = {
      instance: this.state.regexTree.instance,
      nodes: regexTreeNodes,
      edges: regexTreeEdges
    };
  }

  this.setState(state);
};
