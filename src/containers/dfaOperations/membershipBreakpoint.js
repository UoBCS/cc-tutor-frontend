import automata from 'utils/automata';
import clone from 'clone';
import _ from 'lodash';
import ui from 'utils/ui';

export const breakpoint = {};

/**
 * Forward
 */

breakpoint.forward = {};

breakpoint.forward.acceptsStep = function ({ data, index }) {
  automata.highlightEdges(this.state.dfa, [{
    src: data.transition.src.id,
    char: data.transition.char,
    dest: data.transition.dest.id
  }]);

  const { word } = this.state;

  word.index++;

  this.setState({ word });

  const str = `Consider the character "${data.transition.char}"`;

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      breakpoint: data
    });
  }
};

breakpoint.forward.acceptsStop = function ({ data, index }) {
  const str = `Membership test finished. The automaton does ${data.result ? '' : 'NOT'} accept the word.`;

  ui.obj.toast.show(str);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: str,
      breakpoint: data
    });
  }
};

breakpoint.commit = function (cb = null) {
  let visualizationStates = this.state.visualizationStates || [];

  visualizationStates.push({
    word: clone(this.state.word),
    dfa: {
      nodes: clone(this.state.dfa.nodes),
      edges: clone(this.state.dfa.edges)
    }
  });

  this.setState({ visualizationStates }, cb);
};

breakpoint.rollback = function () {
  let visualizationStates = this.state.visualizationStates || [];

  let visualizationState = visualizationStates.pop();

  const dfaNodes = clone(visualizationState.dfa.nodes);
  const dfaEdges = clone(visualizationState.dfa.edges);

  this.state.dfa.instance.setData({
    nodes: dfaNodes,
    edges: dfaEdges
  });

  this.setState({
    word: clone(visualizationState.word),
    dfa: {
      instance: this.state.dfa.instance,
      nodes: dfaNodes,
      edges: dfaEdges
    },
    visualizationStates
  });
};
