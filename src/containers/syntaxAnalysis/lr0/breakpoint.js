import React from 'react';
import { Icon, Label } from 'semantic-ui-react';
import automata from 'utils/automata';
import tree from 'utils/tree';
import clone from 'clone';
import _ from 'lodash';
import ui from 'utils/ui';

const breakpoint = {};

/**
 * Forward
 */

breakpoint.forward = {};

breakpoint.forward.globalInitialize = function ({ data, index }) {
  this.setState({ stack: data.stack });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Initialize components.',
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

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Consider state ${data.state.id}.`,
      data: breakpoint
    });
  }
};

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

breakpoint.forward.shift = function ({ data, index }) {
  updateDataStructures.call(this, data);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Perform shift action.',
      data: breakpoint
    });
  }
};

breakpoint.forward.reduce = function ({ data, index }) {
  updateDataStructures.call(this, data);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Perform reduce action.',
      data: breakpoint
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

  this.setState({ visualizationStates });
};

breakpoint.visualizationStates.rollback = function () {
  let { visualizationStates } = this.state;

  let visualizationState = visualizationStates.pop();

  if (visualizationState === undefined) {
    return;
  }

  const parseTreeNodes = clone(visualizationState.parseTree.nodes);
  const parseTreeEdges = clone(visualizationState.parseTree.edges);
  const itemsDfaNodes = clone(visualizationState.itemsDfa.nodes);
  const itemsDfaEdges = clone(visualizationState.itemsDfa.edges);

  this.state.parseTree.instance.setData({
    nodes: parseTreeNodes,
    edges: parseTreeEdges
  });

  this.state.itemsDfa.instance.setData({
    nodes: itemsDfaNodes,
    edges: itemsDfaEdges
  });

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

export default breakpoint;
