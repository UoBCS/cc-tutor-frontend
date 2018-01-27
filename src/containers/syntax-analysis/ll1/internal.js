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
    stack: data.stack,
    parseTree: tree.visDataFormat('parse-tree-viz', data.parse_tree, 'node'),
    tokens
  })
};

internal.forward.initPredict = function ({ data, index }) {
  ui.obj.message.show(this, 'info', 'Algorithm information', 'Starting predict step because the top of the stack is a non-terminal.');
};

internal.forward.initFirstAll = function ({ data, index }) {
  const first = this.state.first || {};

  first.argument = data.alpha;
  first.result = data.first_set;

  this.setState({ first });
};

internal.forward.firstAllAccumulator = function ({ data, index }) {
  const first = this.state.first;
  const obj = {argument: data.grammar_entity, result: data.first};

  if (first.localExecution === undefined) {
    first.localExecution = [obj];
  } else {
    first.localExecution.push(obj);
  }

  first.result = data.first_set;

  this.setState({ first });
};

internal.forward.firstNoEpsilon = function ({ data, index }) {
  const first = this.state.first;

  first.message = 'No epsilon in first, therefore finish.';

  this.setState({ first });
};

internal.forward.endFirstAll = function ({ data, index }) {
  const first = this.state.first;

  first.message = 'Finished processing first';
  first.result = data.first_set;

  this.setState({ first });
};

internal.forward.firstSetAddEpsilon = function ({ data, index }) {
 // TODO: Finish this
};

internal.forward.predictChosenProduction = function ({ data, index }) {
  const lhs = data.production[0];
  const rhs = data.production[1].join('');
  const token = this.state.tokens.data[this.state.tokens.index];

  const div = (
    <div style={{ marginTop: 16 }}>
      <p>
        The algorithm chose this production because
        <span style={{ fontFamily: 'monospace', fontWeight: 900 }}>
          {token.type.name !== undefined ? token.type.name : token.type} ∈ FIRST({rhs})
        </span>
      </p>
      <Label style={{ fontFamily: 'monospace' }} size='large'>{lhs}</Label>
      <Icon name='long arrow right'/>
      <Label style={{ fontFamily: 'monospace' }} size='large'>{rhs}</Label>
    </div>
  );

  ui.obj.message.show(this, 'info', 'Algorithm information', div);
};

internal.forward.endPredict = function ({ data, index }) {
  this.setState({ first: null });
};

internal.backward = {};

export default internal;
