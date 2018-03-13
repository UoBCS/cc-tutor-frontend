import automata from 'utils/automata';
import clone from 'clone';
import _ from 'lodash';

export const breakpoint = {};

/**
 * Forward
 */

breakpoint.forward = {};

breakpoint.forward.highlightInitialNfaState = function ({data, index}) {
  automata.highlightNodes(this.state.nfa, [data.state.id]);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Consider the initial NFA state',
      breakpoint: data
    });
  }
};

breakpoint.forward.initialStateEpsilonClosure = function ({data, index}) {
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

breakpoint.forward.initialDfaState = function ({data, index}) {
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

breakpoint.forward.possibleInputs = function ({data, index}) {
  automata.resetNodesHighlight(this.state.nfa);
  automata.resetEdgesHighlight(this.state.nfa);
  automata.resetNodesHighlight(this.state.dfa);

  const edges = _.flatten(data.transitions.map(e => e.dest.map(dest => ({
    src: e.src.id, char: e.char, dest: dest.id
  }))));

  automata.highlightEdges(this.state.nfa, edges);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `NFA states {${data.dfa_state_contents}} give the possible inputs to follow: {${data.possible_inputs}}`,
      breakpoint: data
    });
  }
};

breakpoint.forward.moveStates = function ({data, index}) {
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

breakpoint.forward.epsilonClosure = function ({ data, index }) {
  automata.highlightNodes(this.state.nfa, data.output.map(s => s.id), automata.highlightOptions.highlightState[1].color.background);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `ε-closure of NFA states {${data.input.map(s => s.id).join(', ')}}: {${data.output.map(s => s.id).join(', ')}}`,
      breakpoint: data
    });
  }
};

breakpoint.forward.newDfaTransition = function ({ data, index }) {
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

/**
 * Visualization states
 */

breakpoint.visualizationStates = {};

breakpoint.visualizationStates.commit = function () {
  let { visualizationStates } = this.state;

  visualizationStates.push({
    nfa: {
      nodes: clone(this.state.nfa.nodes),
      edges: clone(this.state.nfa.edges)
    },
    dfa: {
      nodes: clone(this.state.dfa.nodes),
      edges: clone(this.state.dfa.edges)
    }
  });

  this.setState({ visualizationStates });
};

breakpoint.visualizationStates.rollback = function () {
  let visualizationStates = this.state.visualizationStates || [];

  let visualizationState = visualizationStates.pop();

  const nfaNodes = clone(visualizationState.nfa.nodes);
  const nfaEdges = clone(visualizationState.nfa.edges);
  const dfaNodes = clone(visualizationState.dfa.nodes);
  const dfaEdges = clone(visualizationState.dfa.edges);

  this.state.nfa.instance.setData({
    nodes: nfaNodes,
    edges: nfaEdges
  });

  this.state.dfa.instance.setData({
    nodes: dfaNodes,
    edges: dfaEdges
  });

  this.setState({
    nfa: {
      instance: this.state.nfa.instance,
      nodes: nfaNodes,
      edges: nfaEdges
    },
    dfa: {
      instance: this.state.dfa.instance,
      nodes: dfaNodes,
      edges: dfaEdges
    },
    visualizationStates
  });
};

/**
 * Event handlers
 */

breakpoint.eventHandlers = {};

breakpoint.eventHandlers.visualizeForward = function (b) {
  breakpoint.visualizationStates.commit.call(this);

  breakpoint.forward[_.camelCase(b.label)].call(this, {
    label: b.label,
    data: b.data,
    index: this.state.breakpoint.index
  });
};

breakpoint.eventHandlers.visualizeBackward = function (b) {
  if (breakpoint.backward !== undefined && breakpoint.backward[_.camelCase(b.label)] !== undefined) {
    breakpoint.backward[_.camelCase(b.label)].call(this, {
      label: b.label,
      data: b.data,
      index: this.state.breakpoint.index
    });
  } else {
    breakpoint.visualizationStates.rollback.call(this);
    this.refs.actionsHistory.addOrSelect(this.state.breakpoint.index);
  }
};
