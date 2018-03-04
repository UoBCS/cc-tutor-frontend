import automata from 'utils/automata';
import _ from 'lodash';

const internal = {};

internal.forward = {};

internal.forward.highlightInitialNfaState = function ({data, index}) {
  automata.highlightNodes(this.state.nfa, [data.state.id]);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Consider the initial NFA state',
      breakpoint: data
    });
  }
};

internal.forward.initialStateEpsilonClosure = function ({data, index}) {
  automata.resetNodesHighlight(this.state.nfa);

  let reachableStates = data.reachable_states.map(s => s.id);
  automata.highlightNodes(this.state.nfa, reachableStates);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `ε-closure of NFA state ${data.initial.id}: {${reachableStates.join(', ')}}`,
      breakpoint: data
    });
  }
};

internal.forward.initialDfaState = function ({data, index}) {
  automata.resetNodesHighlight(this.state.nfa);

  // Highlight NFA states
  let nfaStates = data.states.map(s => s.id);
  automata.highlightNodes(this.state.nfa, nfaStates);

  // Add DFA state
  automata.addNode(this.state.dfa, data.id);
  automata.highlightNodes(this.state.dfa, [data.id]);
  automata.updateNodesAttr(this.state.dfa, [{
    id: data.id,
    title: `Corresponding NFA states: {${nfaStates.join(', ')}}`
  }]);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Initial DFA state ${data.id} formed by the previous NFA states: {${nfaStates.join(', ')}}`,
      breakpoint: data
    });
  }
};

internal.forward.possibleInputs = function ({data, index}) {
  automata.resetNodesHighlight(this.state.nfa);
  automata.resetEdgesHighlight(this.state.nfa);
  automata.resetNodesHighlight(this.state.dfa);

  const edges = _.flatten(data.transitions.map(e => e.dest.map(dest => ({
    src: e.src.id, char: e.char, dest: dest.id
  }))));

  automata.highlightNodes(this.state.nfa, data.dfa_state_contents);
  automata.highlightEdges(this.state.nfa, edges);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `NFA states {${data.dfa_state_contents}} give the possible inputs to follow: {${data.possible_inputs}}`,
      breakpoint: data
    });
  }
};

internal.forward.moveStates = function ({data, index}) {
  automata.resetNodesHighlight(this.state.nfa);

  automata.highlightNodes(this.state.nfa, [data.state.id].concat(data.connected_states.map(s => s.id)));

  let connectedStatesString = `${!data.connected_states.length
          ? `no state: there is no '${data.char}' transition`
          : `{${data.connected_states.map(s => s.id).join(', ')}}`}`;

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Move action: NFA state ${data.state.id} moves to ${connectedStatesString}`,
      breakpoint: data
    });
  }
};

internal.forward.epsilonClosure = function ({ data, index }) {
  automata.highlightNodes(this.state.nfa, data.output.map(s => s.id), automata.highlightOptions.highlightState[1].color.background);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `ε-closure of NFA states {${data.input.map(s => s.id).join(', ')}}: {${data.output.map(s => s.id).join(', ')}}`,
      breakpoint: data
    });
  }
};

internal.forward.newDfaTransition = function ({ data, index }) {
  const nfaStates = data.dest.states.map(s => s.id).join(', ');

  automata.addNode(this.state.dfa, data.dest);
  automata.updateNodesAttr(this.state.dfa, [{
    id: data.dest.id,
    title: `Corresponding NFA states: ${nfaStates}`
  }]);
  automata.addEdge(this.state.dfa, data.src, data.dest, data.char);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `New DFA state ${data.dest.id} formed by NFA states {${nfaStates}}`,
      breakpoint: data
    });
  }
};

internal.backward = {};

export default internal;
