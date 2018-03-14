import automata from 'utils/automata';
import clone from 'clone';
import _ from 'lodash';

export const breakpoint = {};

const updateTable = function (data) {
  const cols = data.table.cols.map(c => c.id === -1 ? 'Error state' : c.id);
  const rows = data.table.rows.map(r => r.id === -1 ? 'Error state' : r.id);

  this.setState({
    table: {
      cols,
      rows,
      contents: data.table.contents
    }
  });
};

/**
 * Forward
 */

breakpoint.forward = {};

breakpoint.forward.inputDfa = function ({ data, index }) {
  this.setState({
    dfa: automata.visDataFormat('dfa-viz', data.dfa)
  });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Consider the DFA to minimize',
      breakpoint: data
    });
  }
}

breakpoint.forward.reachableStates = function ({ data, index }) {
  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Reachable states: {${data.states.map(s => s.id === -1 ? 'Error state' : s.id).join(', ')}}`,
      breakpoint: data
    });
  }
};

breakpoint.forward.initialTable = function ({ data, index }) {
  updateTable.call(this, data);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Initial table contents',
      breakpoint: data
    });
  }
};

breakpoint.forward.updatedTable = function ({ data, index }) {
  updateTable.call(this, data);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Update table contents',
      breakpoint: data
    });
  }
};

breakpoint.forward.unmarkedStates = function ({ data, index }) {
  // TODO: finish this

  const { states } = data;

  for (const pair of states) {

  }

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: states.length === 0 ? 'There are no states to merge.' : 'Unmarked pair of states have been highlighted.',
      breakpoint: data
    });
  }
};

breakpoint.forward.updatedDfa = function ({ data, index }) {
  this.setState({
    minDfa: automata.visDataFormat('min-dfa-viz', data.dfa)
  });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Unmarked pairs have been merged.',
      breakpoint: data
    });
  }
};

breakpoint.forward.finish = function ({ data, index }) {
  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'The minimization has finished.',
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
    },
    table: clone(this.state.table)
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
    table: clone(visualizationState.table),
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
