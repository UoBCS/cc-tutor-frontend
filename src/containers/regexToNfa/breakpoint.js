import automata from 'utils/automata';
import _ from 'lodash';

const breakpoint = {};

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

  this.refs.actionsHistory.addOrSelect(index, {
    title: `Add ${breakpoint.utils.map[label]} transition from state ${data.entry.id} to state ${data.exit.id}`,
    breakpoint: data
  });
};

breakpoint.forward.c = breakpoint.forward.e;

breakpoint.forward.s = breakpoint.forward.e;

breakpoint.forward.rep = function ({data, index, label}) {
  automata.addEdge(this.state.nfa, data.state1, data.state2, automata.EPSILON);
  automata.addEdge(this.state.nfa, data.state2, data.state1, automata.EPSILON);

  this.refs.actionsHistory.addOrSelect(index, {
    title: `Add ${breakpoint.utils.map[label]} transitions between states ${data.state1} and ${data.state2} to form repetition`,
    breakpoint: data
  });
};

breakpoint.forward.or1 = function ({data, index}) {
  automata.addNode(this.state.nfa, data.entry);

  this.refs.actionsHistory.addOrSelect(index, {
    title: `Add entry choice state ${data.entry.id}`,
    breakpoint: data
  });
};

breakpoint.forward.or2 = function ({data, index}) {
  automata.addEdge(this.state.nfa, data.entry, data.choices[0], automata.EPSILON);
  automata.addEdge(this.state.nfa, data.entry, data.choices[1], automata.EPSILON);

  this.refs.actionsHistory.addOrSelect(index, {
    title: `Add ${automata.EPSILON}-transitions to choice states ${data.choices[0].id} and ${data.choices[1].id} from entry state ${data.entry.id}`,
    breakpoint: data
  });
};

breakpoint.forward.or3 = function ({data, index}) {
  automata.addNode(this.state.nfa, data.exit);

  this.refs.actionsHistory.addOrSelect(index, {
    title: `Add exit choice state ${data.exit.id}`,
    breakpoint: data
  });
};

breakpoint.forward.or4 = function ({data, index}) {
  automata.addEdge(this.state.nfa, data.choices[0], data.exit, automata.EPSILON);
  automata.addEdge(this.state.nfa, data.choices[1], data.exit, automata.EPSILON);

  this.refs.actionsHistory.addOrSelect(index, {
    title: `Add ${automata.EPSILON}-transitions from choice states ${data.choices[0].id} and ${data.choices[1].id} to exit state ${data.exit.id}`,
    breakpoint: data
  });
};

/**
 * Backward
 */

breakpoint.backward = {};

breakpoint.backward.e = function ({data, index}) {
  automata.removeEdge(this.state.nfa, data.entry, data.exit, data.transition);
  this.refs.actionsHistory.addOrSelect(index);
};

breakpoint.backward.c = breakpoint.backward.e;

breakpoint.backward.s = breakpoint.backward.e;

breakpoint.backward.rep = function ({data, index}) {
  automata.removeEdge(this.state.nfa, data.state1, data.state2, automata.EPSILON);
  automata.removeEdge(this.state.nfa, data.state2, data.state1, automata.EPSILON);
  this.refs.actionsHistory.addOrSelect(index);
};

breakpoint.backward.or1 = function ({data, index}) {
  automata.removeNode(this.state.nfa, data.entry);
  this.refs.actionsHistory.addOrSelect(index);
};

breakpoint.backward.or2 = function ({data, index}) {
  automata.removeEdge(this.state.nfa, data.entry, data.choices[0], automata.EPSILON);
  automata.removeEdge(this.state.nfa, data.entry, data.choices[1], automata.EPSILON);
  this.refs.actionsHistory.addOrSelect(index);
};

breakpoint.backward.or3 = function ({data, index}) {
  automata.removeNode(this.state.nfa, data.exit);
  this.refs.actionsHistory.addOrSelect(index);
};

breakpoint.backward.or4 = function ({data, index}) {
  automata.removeEdge(this.state.nfa, data.choices[0], data.exit, automata.EPSILON);
  automata.removeEdge(this.state.nfa, data.choices[1], data.exit, automata.EPSILON);
  this.refs.actionsHistory.addOrSelect(index);
};

/**
 * Event handlers
 */

breakpoint.eventHandlers = {};

breakpoint.eventHandlers.visualizeForward = function (b) {
  breakpoint.forward[_.camelCase(b.label)].call(this, {
    label: b.label,
    data: b.data,
    index: this.state.breakpoint.index
  });
};

breakpoint.eventHandlers.visualizeBackward = function (b) {
  breakpoint.backward[_.camelCase(b.label)].call(this, {
    label: b.label,
    data: b.data,
    index: this.state.breakpoint.index
  });
};

export default breakpoint;
