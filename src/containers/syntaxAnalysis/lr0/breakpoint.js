import React from 'react';
import { Icon, Label } from 'semantic-ui-react';
import automata from 'utils/automata';
import tree from 'utils/tree';
import clone from 'clone';
import _ from 'lodash';
import ui from 'utils/ui';

export const breakpoint = {};

const updateDataStructures = function (data) {
  automata.resetEdgesHighlight(this.state.itemsDfa);
  automata.highlightEdges(this.state.itemsDfa, [data.transition]);

  const tokens = this.state.tokens;
  tokens.index = data.input_index;

  this.setState({
    stack: data.stack,
    parseTree: tree.visDataFormat('parse-tree-viz', data.parse_tree, 'node', false),
    tokens
  });
};

/**
 * Forward
 */

breakpoint.forward = {};

breakpoint.forward.globalInitialize = function ({ data, index }) {
  this.setState({ stack: data.stack });

  const str = 'Initialize components.';

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      data: breakpoint
    });
  }
};

breakpoint.forward.initialize = function ({ data, index }) {
  automata.resetEdgesHighlight(this.state.itemsDfa);
  automata.resetNodesHighlight(this.state.itemsDfa);
  automata.highlightNodes(this.state.itemsDfa, [data.state.id]);

  const tokens = this.state.tokens;
  tokens.index = data.input_index;
  this.setState({ tokens });

  const str = `Consider state ${data.state.id}.`;

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      data: breakpoint
    });
  }
};

breakpoint.forward.shift = function ({ data, index }) {
  updateDataStructures.call(this, data);

  const str = 'Perform shift action.';

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      data: breakpoint
    });
  }
};

breakpoint.forward.reduce = function ({ data, index }) {
  updateDataStructures.call(this, data);

  const str = 'Perform reduce action.';

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      data: breakpoint
    });
  }
};

breakpoint.commit = function (cb = null) {
  let visualizationStates = this.state.visualizationStates || [];

  visualizationStates.push({
    stack: clone(this.state.stack),
    tokens: clone(this.state.tokens),
    parseTree: {
      nodes: clone(this.state.parseTree.nodes),
      edges: clone(this.state.parseTree.edges)
    },
    itemsDfa: {
      nodes: clone(this.state.itemsDfa.nodes),
      edges: clone(this.state.itemsDfa.edges)
    },
  });

  this.setState({ visualizationStates }, cb);
};

breakpoint.rollback = function () {
  let { visualizationStates } = this.state;

  let visualizationState = visualizationStates.pop();

  if (visualizationState === undefined) {
    return;
  }

  const parseTreeNodes = clone(visualizationState.parseTree.nodes);
  const parseTreeEdges = clone(visualizationState.parseTree.edges);
  const itemsDfaNodes = clone(visualizationState.itemsDfa.nodes);
  const itemsDfaEdges = clone(visualizationState.itemsDfa.edges);

  if (this.state.parseTree.instance) {
    this.state.parseTree.instance.setData({
      nodes: parseTreeNodes,
      edges: parseTreeEdges
    });
  }

  if (this.state.itemsDfa.instance) {
    this.state.itemsDfa.instance.setData({
      nodes: itemsDfaNodes,
      edges: itemsDfaEdges
    });
  }

  this.setState({
    parseTree: {
      instance: this.state.parseTree.instance,
      nodes: parseTreeNodes,
      edges: parseTreeEdges
    },
    itemsDfa: {
      instance: this.state.itemsDfa.instance,
      nodes: itemsDfaNodes,
      edges: itemsDfaEdges
    },
    stack: clone(visualizationState.stack),
    tokens: clone(visualizationState.tokens),
    visualizationStates
  });
};
