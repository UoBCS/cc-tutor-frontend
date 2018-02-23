import React from 'react';
import { Icon, Label } from 'semantic-ui-react';
import automata from 'utils/automata';
import ui from 'utils/ui';
import tree from 'utils/tree';
import _ from 'lodash';

const internal = {};

internal.forward = {};

internal.forward.preStep = function ({ data, index }) {
  const tokens = this.state.tokens;

  tokens.index = data.input_index;

  this.setState({
    ff: null,
    stack: data.stack,
    parseTree: tree.visDataFormat('parse-tree-viz', data.parse_tree, 'node'),
    tokens
  });

  ui.obj.message.hide(this);
};

internal.forward.initPredict = function ({ data, index }) {
  ui.obj.message.show(this, 'info', 'Algorithm information', 'Starting predict step because the top of the stack is a non-terminal.');
};

internal.forward.first = function ({ data, index }) {
  const ff = this.state.ff || {};

  ff.type = 'FIRST';
  ff.argument = data.alpha.length === 0 ? [automata.EPSILON] : data.alpha;
  ff.result = data.first_set;

  this.setState({ ff });
};

internal.forward.follow = function ({ data, index }) {
  const ff = this.state.ff || {};

  ff.type = 'FOLLOW';
  ff.argument = [data.non_terminal];
  ff.result = data.follow_set;

  this.setState({ ff });
};

internal.forward.predictChosenProduction = function ({ data, index }) {
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

  ui.obj.message.show(this, 'info', 'Algorithm information', div);
};

internal.forward.matchInputIndex = function ({ data, index }) {
  const tokens = this.state.tokens;
  tokens.index = data.input_index;
  this.setState({ tokens });

  ui.obj.message.show(this, 'info', 'Algorithm information', 'Matched input on top of the stack.');
};

internal.forward.parseError = function ({ data, index }) {

};

internal.forward.parseEnd = function ({ data, index }) {

};

internal.backward = {};

export default internal;
