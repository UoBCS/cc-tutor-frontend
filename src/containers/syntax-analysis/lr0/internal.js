import React from 'react';
import automata from 'utils/automata';
import tree from 'utils/tree';
import ui from 'utils/ui';

const internal = {};

internal.forward = {};

internal.forward.initialize = function ({ data, index }) {
  ui.obj.message.show(this, 'info', 'Algorithm information', `Consider state ${data.state.id}`);

  automata.resetNodesHighlight(this.state.itemsDfa);
  automata.highlightNodes(this.state.itemsDfa, [data.state.id]);

  const tokens = this.state.tokens;
  tokens.index = data.input_index;
  this.setState({ tokens });
};

internal.forward.shift = function ({ data, index }) {

};

internal.forward.reduce = function ({ data, index }) {

};

internal.backward = {};

export default internal;
