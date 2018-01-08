import automata from 'utils/automata';
import _ from 'lodash';

const internal = {};

/*internal.stepInto = function () {
  let breakpointData = this.state.breakpoint;
  breakpointData.indexStack.push(0);
  breakpointData.scopeStack.push('data');

  this.setState({ breakpoint: breakpointData });
};*/

internal.highlightInitialNfaState = function ({data, index}) {
  console.log(this);
  automata.highlightNodes(this.state.nfa, [data.state.id]);

  this.refs.actionsHistory.addOrSelect(index, {
    title: 'Consider the initial NFA state',
    breakpoint: data
  });
};

internal.initialStateEpsilonClosure = function ({data, index}) {
  automata.resetNodesHighlight(this.state.nfa);

  let reachableStates = data.reachable_states.map(s => s.id);
  automata.highlightNodes(this.state.nfa, reachableStates);

  this.refs.actionsHistory.addOrSelect(index, {
    title: `ε-closure of NFA state ${data.initial.id}: {${reachableStates.join(', ')}}`,
    breakpoint: data
  });
};

internal.initialDfaState = function ({data, index}) {
  automata.resetNodesHighlight(this.state.nfa);

  // Highlight NFA states
  let nfaStates = data.states.map(s => s.id);
  automata.highlightNodes(this.state.nfa, nfaStates);

  // Add DFA state
  automata.addNode(this.state.dfa, data.id);
  automata.highlightNodes(this.state.dfa, [data.id]);

  this.refs.actionsHistory.addOrSelect(index, {
    title: `Initial DFA state ${data.id} formed by the previous NFA states: {${nfaStates.join(', ')}}`,
    breakpoint: data
  });
};

internal.possibleInputs = function ({data, index}) {
  automata.resetNodesHighlight(this.state.nfa);

  const edges = _.flatten(data.transitions.map(e => e.dest.map(dest => ({
    src: e.src.id, char: e.char, dest: dest.id
  }))));

  automata.highlightEdges(this.state.nfa, edges);

  this.refs.actionsHistory.addOrSelect(index, {
    title: `NFA states {${data.dfa_state_contents}} give the possible inputs to follow: {${data.possible_inputs}}`,
    breakpoint: data
  });
};

internal.moveStates = function ({data, index}) {
  automata.resetNodesHighlight(this.state.nfa);

  automata.highlightNodes(this.state.nfa, [data.state.id].concat(data.connected_states.map(s => s.id)));

  let connectedStatesString = `${!data.connected_states.length ? 'no state' : `{${data.connected_states.map(s => s.id).join(', ')}}`}`

  this.refs.actionsHistory.addOrSelect(index, {
    title: `Move action: NFA state ${data.state.id} moves to ${connectedStatesString}`,
    breakpoint: data
  });
};

internal.epsilonClosure = function ({ data, index }) {

};

export default internal;
