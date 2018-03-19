import automata from 'utils/automata';
import globalBreakpointProcessor from 'utils/globalBreakpointProcessor';
import ui from 'utils/ui';
import clone from 'clone';
import _ from 'lodash';
import randomColor from 'randomcolor';

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

  const str = 'Consider the DFA to minimize';

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      breakpoint: data
    });
  }
}

breakpoint.forward.reachableStates = function ({ data, index }) {
  const str = `Reachable states: {${data.states.map(s => s.id === -1 ? 'Error state' : s.id).join(', ')}}`;

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      breakpoint: data
    });
  }
};

breakpoint.forward.initialTable = function ({ data, index }) {
  updateTable.call(this, data);

  const str = 'Initial table contents';

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      breakpoint: data
    });
  }
};

breakpoint.forward.updatedTable = function ({ data, index }) {
  updateTable.call(this, data);

  const str = 'Update table contents';

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      breakpoint: data
    });
  }
};

breakpoint.forward.unmarkedStates = function ({ data, index }) {
  const { states } = data;

  for (const pair of states) {
    const color = randomColor();
    automata.highlightNodes(this.state.dfa, pair.map(s => s.id), color);
  }

  const str = states.length === 0 ? 'There are no states to merge.' : 'Unmarked pair of states have been highlighted.';

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      breakpoint: data
    });
  }
};

breakpoint.forward.updatedDfa = function ({ data, index }) {
  this.setState({
    minDfa: automata.visDataFormat('min-dfa-viz', data.dfa)
  });

  const str = 'Unmarked pairs have been merged (if any).';

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      breakpoint: data
    });
  }
};

breakpoint.forward.finish = function ({ data, index }) {
  const str = 'The minimization has finished.';

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      breakpoint: data
    });
  }
};

breakpoint.commit = function (cb = null) {
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

  this.setState({ visualizationStates }, cb);
};

breakpoint.rollback = function () {
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
