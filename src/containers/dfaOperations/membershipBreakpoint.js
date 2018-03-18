import automata from 'utils/automata';
import clone from 'clone';
import _ from 'lodash';

export const breakpoint = {};

/**
 * Forward
 */

breakpoint.forward = {};

breakpoint.forward.acceptsStep = function ({ data, index }) {
  automata.highlightEdges(this.state.dfa, [{
    src: data.transition.src.id,
    char: data.transition.char,
    dest: data.transition.dest.id
  }]);

  const { word } = this.state;

  word.index++;

  this.setState({ word });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Consider the character "${data.transition.char}"`,
      breakpoint: data
    });
  }
};

breakpoint.forward.acceptsStop = function ({ data, index }) {
  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Membership test finished. The automaton does ${data.result ? '' : 'NOT'} accept the word.`,
      breakpoint: data
    });
  }
};

/**
 * Visualization states
 */

breakpoint.visualizationStates = {};

breakpoint.visualizationStates.commit = function () {
  let visualizationStates = this.state.visualizationStates || [];

  visualizationStates.push({
    word: clone(this.state.word),
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

  const dfaNodes = clone(visualizationState.dfa.nodes);
  const dfaEdges = clone(visualizationState.dfa.edges);

  this.state.dfa.instance.setData({
    nodes: dfaNodes,
    edges: dfaEdges
  });

  this.setState({
    word: clone(visualizationState.word),
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
