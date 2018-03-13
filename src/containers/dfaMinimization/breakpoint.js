import automata from 'utils/automata';
import clone from 'clone';
import _ from 'lodash';

export const breakpoint = {};

/**
 * Forward
 */

breakpoint.forward = {};

breakpoint.forward.reachableStates = function ({ data, index }) {

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Reachable states: {${data.states.map(s => s.id).join(', ')}}`,
      breakpoint: data
    });
  }
};

breakpoint.forward.initialTable = function ({ data, index }) {

  const cols = data.table.cols.map(c => c.id);
  const rows = data.table.rows.map(r => r.id);

  this.setState({
    table: {
      cols,
      rows,
      contents: data.table.contents
    }
  });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Initial table contents',
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
    dfa: {
      nodes: clone(this.state.dfa.nodes),
      edges: clone(this.state.dfa.edges)
    },
    minDfa: {
      nodes: clone(this.state.minDfa.nodes),
      edges: clone(this.state.minDfa.edges)
    }
  });

  this.setState({ visualizationStates });
};

breakpoint.visualizationStates.rollback = function () {
  let { visualizationStates } = this.state;

  let visualizationState = visualizationStates.pop();

  const dfaNodes = clone(visualizationState.dfa.nodes);
  const dfaEdges = clone(visualizationState.dfa.edges);
  const minDfaNodes = clone(visualizationState.minDfa.nodes);
  const minDfaEdges = clone(visualizationState.minDfa.edges);

  this.state.dfa.instance.setData({
    nodes: dfaNodes,
    edges: dfaEdges
  });

  this.state.minDfa.instance.setData({
    nodes: minDfaNodes,
    edges: minDfaEdges
  });

  this.setState({
    dfa: {
      instance: this.state.dfa.instance,
      nodes: dfaNodes,
      edges: dfaEdges
    },
    minDfa: {
      instance: this.state.minDfa.instance,
      nodes: minDfaNodes,
      edges: minDfaEdges
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
