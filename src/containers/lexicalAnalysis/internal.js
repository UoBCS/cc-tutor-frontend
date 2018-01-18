import React from 'react';
import automata from 'utils/automata';
import _ from 'lodash';
import ui from 'utils/ui';

const internal = {};

internal.forward = {};

internal.forward.init = function ({ data, index }) {
  automata.resetNodesHighlight(this.state.dfa);
  automata.highlightNodes(this.state.dfa, [data.state.id]);

  let tokens = this.state.tokens;

  if (tokens.data === null) {
    tokens.data = [];
  }

  tokens.data.push({
    text: 'No text',
    line: 1,
    column: 0,
    type: null
  });
  tokens.index = tokens.data.length - 1;

  this.setState({
    stateStack: [data.state],
    tokens
  });
};

internal.forward.considerState = function ({ data, index }) {
  automata.resetNodesHighlight(this.state.dfa);
  automata.highlightNodes(this.state.dfa, [data.state.id]);

  this.setState({ stateStack: data.stack });
};

internal.forward.consumeChar = function ({ data, index }) {
  let content = this.state.content;
  content.index = data.index;
  this.setState({ content });
};

internal.forward.stateNeighbours = function ({ data, index }) {
  automata.highlightNodes(this.state.dfa, data.neighbours.map(s => s.id));

  if (data.neighbours.length === 0) {
    ui.obj.modal.show(this, 'Warning', 'There are no reachable neighbours matching the selected character.');
  }
};

internal.forward.updateText = function ({ data, index }) {
  let tokens = this.state.tokens;
  tokens.data[tokens.index].text = data.token_text;

  this.setState({
    stateStack: data.stack,
    tokens
  });
};

internal.forward.highestPriorityLexeme = function ({ data, index }) {
  const tokenTypes = data.state.map(tokenType => <li>{tokenType.name}, {tokenType.regex}, priority: {tokenType.priority}</li>);

  ui.obj.modal.show(this, 'Finished token processing', (
    <div>
      <h3>Encountered lexemes</h3>
      <ul>
        {tokenTypes}
      </ul>

      <h3>Chosen lexeme</h3>
      The lexeme ({data.token_type.name}, {data.token_type.regex}) has been chosen since it has
      the highest priority ({data.token_type.priority}).
    </div>
  ));

  // Update content index
  let content = this.state.content;
  content.index = data.content_index;
  this.setState({ content });
};

internal.forward.producedToken = function ({ data, index }) {
  let tokens = this.state.tokens;

  tokens.data[tokens.index] = {
    text: data.token.text,
    line: data.token.line,
    column: data.token.column,
    type: data.token.type.name
  };

  this.setState({ tokens });
}

internal.backward = {};

export default internal;
