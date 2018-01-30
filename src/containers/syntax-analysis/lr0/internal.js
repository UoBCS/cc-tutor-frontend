import React from 'react';
import automata from 'utils/automata';
import tree from 'utils/tree';
import ui from 'utils/ui';

const internal = {};

internal.forward = {};

internal.forward.globalInitialize = function ({ data, index }) {
  this.setState({ stack: data.stack });
};

internal.forward.initialize = function ({ data, index }) {
  ui.obj.message.show(this, 'info', 'Algorithm information', `Consider state ${data.state.id}`);

  automata.resetEdgesHighlight(this.state.itemsDfa);
  automata.resetNodesHighlight(this.state.itemsDfa);
  automata.highlightNodes(this.state.itemsDfa, [data.state.id]);

  const tokens = this.state.tokens;
  tokens.index = data.input_index;
  this.setState({ tokens });
};

/*
"lr_item": {
    "lhs": "t",
    "rhs": [
        "LPAREN",
        "e",
        "RPAREN"
    ],
    "dotIndex": 0
},
"transition": {
    "src": 0,
    "char": "LPAREN",
    "dest": 1
}
*/

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

internal.forward.shift = function ({ data, index }) {
  updateDataStructures.call(this, data);
};

internal.forward.reduce = function ({ data, index }) {
  updateDataStructures.call(this, data);
};

internal.backward = {};

export default internal;
