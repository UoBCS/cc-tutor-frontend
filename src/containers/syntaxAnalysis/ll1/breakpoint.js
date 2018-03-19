import React from 'react';
import { Icon, Label } from 'semantic-ui-react';
import automata from 'utils/automata';
import tree from 'utils/tree';
import clone from 'clone';
import _ from 'lodash';
import ui from 'utils/ui';

export const breakpoint = {};

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

  const str = 'Initialization of components';

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      data: breakpoint
    });
  }
};

breakpoint.forward.initPredict = function ({ data, index }) {
  const str = 'Starting predict step because the top of the stack is a non-terminal.';

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
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

  const str = `Evaluate the FIRST of {${ff.argument.join(', ')}}`;

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
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

  const str = `Evaluate the FOLLOW of ${data.non_terminal}.`;

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
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

  const str = 'Matched input on top of the stack.';

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      data: breakpoint
    });
  }
};

breakpoint.forward.parseError = function ({ data, index }) {
  ui.obj.toast.show(data.message);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: data.message,
      data: breakpoint
    });
  }
};

breakpoint.forward.parseEnd = function ({ data, index }) {
  const { tokens } = this.state;

  tokens.index = data.input_index;

  this.setState({
    ff: null,
    stack: data.stack,
    parseTree: tree.visDataFormat('parse-tree-viz', data.parse_tree, 'node'),
    tokens
  });

  const str = 'Parsing phase finished.';

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
    ff: clone(this.state.ff)
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
