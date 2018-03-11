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

breakpoint.forward.preStep = function ({ data, index }) {
  const { tokens } = this.state;

  tokens.index = data.input_index;

  this.setState({
    ff: null,
    stack: data.stack,
    parseTree: tree.visDataFormat('parse-tree-viz', data.parse_tree, 'node'),
    tokens
  });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Initialization of components',
      data: breakpoint
    });
  }
};

breakpoint.forward.initPredict = function ({ data, index }) {
  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Starting predict step because the top of the stack is a non-terminal.',
      data: breakpoint
    });
  }
};

breakpoint.forward.first = function ({ data, index }) {
  const ff = this.state.ff || {};

  ff.type = 'FIRST';
  ff.argument = data.alpha.length === 0 ? [automata.EPSILON] : data.alpha;
  ff.result = data.first_set;

  this.setState({ ff });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Evaluate the FIRST of {${ff.argument.join(', ')}}`,
      data: breakpoint
    });
  }
};

breakpoint.forward.follow = function ({ data, index }) {
  const ff = this.state.ff || {};

  ff.type = 'FOLLOW';
  ff.argument = [data.non_terminal];
  ff.result = data.follow_set;

  this.setState({ ff });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Evaluate the FOLLOW of ${data.non_terminal}.`,
      data: breakpoint
    });
  }
};

breakpoint.forward.predictChosenProduction = function ({ data, index }) {
  const lhs = data.production[0];
  const rhs = data.production[1].length === 0 ? automata.EPSILON : data.production[1].join(' ');
  const token = this.state.tokens.data[this.state.tokens.index];
  const input = token.type.name !== undefined ? token.type.name : token.type;
  const type = data.type;

  const div = (
    <div style={{ marginTop: 16 }}>
      <p>
        The algorithm chose this production because {type === 'first' ?
        <span style={{ fontFamily: 'monospace', fontWeight: 900 }}>
          {input} ∈ FIRST({rhs})
        </span>
        :
        <span style={{ fontFamily: 'monospace', fontWeight: 900 }}>
          {input} ∈ FOLLOW({lhs}) and {automata.EPSILON} ∈ FIRST({rhs}) and {input} ∉ FIRST({rhs})
        </span>
        }
      </p>
      <Label style={{ fontFamily: 'monospace' }} size='large'>{lhs}</Label>
      <Icon name='long arrow right'/>
      <Label style={{ fontFamily: 'monospace' }} size='large'>{rhs}</Label>
    </div>
  );

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, div);
  }
};

breakpoint.forward.matchInputIndex = function ({ data, index }) {
  const tokens = this.state.tokens;
  tokens.index = data.input_index;
  this.setState({ tokens });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Matched input on top of the stack.',
      data: breakpoint
    });
  }
};

breakpoint.forward.parseError = function ({ data, index }) {
  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: data.message,
      data: breakpoint
    });
  }
};

breakpoint.forward.parseEnd = function ({ data, index }) {
  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Parsing phase finished.',
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
    ff: clone(this.state.ff)
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

  this.state.parseTree.instance.setData({
    nodes: parseTreeNodes,
    edges: parseTreeEdges
  });

  this.setState({
    parseTree: {
      instance: this.state.parseTree.instance,
      nodes: parseTreeNodes,
      edges: parseTreeEdges
    },
    stack: clone(visualizationState.stack),
    tokens: clone(visualizationState.tokens),
    ff: clone(visualizationState.ff),
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
