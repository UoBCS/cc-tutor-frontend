import React from 'react';
import automata from 'utils/automata';
import clone from 'clone';
import _ from 'lodash';
import ui from 'utils/ui';

const breakpoint = {};

/**
 * Forward
 */

breakpoint.forward = {};

breakpoint.forward.init = function ({ data, index }) {
  automata.resetNodesHighlight(this.state.dfa);
  automata.highlightNodes(this.state.dfa, [data.state.id]);

  let { tokens } = this.state;

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

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Initialization of components',
      breakpoint: data
    });
  }
};

breakpoint.forward.considerState = function ({ data, index }) {
  automata.resetNodesHighlight(this.state.dfa);
  automata.highlightNodes(this.state.dfa, [data.state.id]);

  this.setState({ stateStack: data.stack });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Consider state ${data.state.id} from the top of the stack`,
      breakpoint: data
    });
  }
};

breakpoint.forward.consumeChar = function ({ data, index }) {
  let content = this.state.content;
  content.index = data.index;
  this.setState({ content });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Consume char',
      breakpoint: data
    });
  }
};

breakpoint.forward.stateNeighbours = function ({ data, index }) {
  const neighbourIds = data.neighbours.map(s => s.id);
  automata.highlightNodes(this.state.dfa, neighbourIds);

  if (data.neighbours.length === 0) {
    ui.obj.modal.show(this, 'Warning', 'There are no reachable neighbours matching the selected character.');
  }

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Select the reachable neighbours matching the character: {${neighbourIds.join(', ')}}`,
      breakpoint: data
    });
  }
};

breakpoint.forward.updateText = function ({ data, index }) {
  let tokens = this.state.tokens;
  tokens.data[tokens.index].text = data.token_text;

  this.setState({
    stateStack: data.stack,
    tokens
  });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Update token text: ${data.token_text}`,
      breakpoint: data
    });
  }
};

breakpoint.forward.highestPriorityLexeme = function ({ data, index }) {
  const tokenTypes = data.state.map((tokenType, i) => <li key={i}>{tokenType.name}, {tokenType.regex}, priority: {tokenType.priority}</li>);

  // Update content index
  let content = this.state.content;
  content.index = data.content_index;
  this.setState({ content });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, (
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
  }
};

breakpoint.forward.producedToken = function ({ data, index }) {
  let tokens = this.state.tokens;

  tokens.data[tokens.index] = {
    text: data.token.text,
    line: data.token.line,
    column: data.token.column,
    type: data.token.type.name
  };

  this.setState({ tokens });

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `The produced token is: [${data.token.text}, ${data.token.type.name}]`,
      data: breakpoint
    });
  }
}

/**
 * Visualization states
 */

breakpoint.visualizationStates = {};

breakpoint.visualizationStates.commit = function () {
  let visualizationStates = this.state.visualizationStates || [];

  visualizationStates.push({
    dfa: {
      nodes: clone(this.state.dfa.nodes),
      edges: clone(this.state.dfa.edges)
    },
    tokens: clone(this.state.tokens),
    stateStack: clone(this.state.stateStack),
    content: clone(this.state.content)
  });    console.log('asdasiduiasd');


  this.setState({ visualizationStates });
};

breakpoint.visualizationStates.rollback = function () {
  let { visualizationStates } = this.state;

  let visualizationState = visualizationStates.pop();

  if (visualizationState === undefined) {
    return;
  }

  const dfaNodes = clone(visualizationState.dfa.nodes);
  const dfaEdges = clone(visualizationState.dfa.edges);

  this.state.dfa.instance.setData({
    nodes: dfaNodes,
    edges: dfaEdges
  });

  this.setState({
    dfa: {
      instance: this.state.dfa.instance,
      nodes: dfaNodes,
      edges: dfaEdges
    },
    tokens: clone(visualizationState.tokens),
    stateStack: clone(visualizationState.stateStack),
    content: clone(visualizationState.content),
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
