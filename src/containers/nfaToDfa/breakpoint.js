import automata from 'utils/automata';
import ui from 'utils/ui';
import misc from 'utils/misc';
import clone from 'clone';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const breakpoint = {};

/**
 * Forward
 */

breakpoint.forward = {};

breakpoint.forward.highlightInitialNfaState = function ({data, index}) {
  automata.highlightNodes(this.state.nfa, [data.state.id]);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: 'Consider the initial NFA state',
      breakpoint: data
    });
  }
};

breakpoint.forward.initialStateEpsilonClosure = function ({data, index}) {
  automata.resetNodesHighlight(this.state.nfa);

  let reachableStates = data.reachable_states.map(s => s.id);
  automata.highlightNodes(this.state.nfa, reachableStates);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `ε-closure of NFA state ${data.initial.id}: {${reachableStates.join(', ')}}`,
      breakpoint: data
    });
  }
};

breakpoint.forward.initialDfaState = function ({data, index}) {
  automata.resetNodesHighlight(this.state.nfa);

  // Highlight NFA states
  let nfaStates = data.states.map(s => s.id);
  automata.highlightNodes(this.state.nfa, nfaStates);

  // Add DFA state
  automata.addNode(this.state.dfa, data.id);
  automata.highlightNodes(this.state.dfa, [data.id]);
  automata.updateNodesAttr(this.state.dfa, [{
    id: data.id,
    title: `Corresponding NFA states: {${nfaStates.join(', ')}}`
  }]);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Initial DFA state ${data.id} formed by the previous NFA states: {${nfaStates.join(', ')}}`,
      breakpoint: data
    });
  }
};

breakpoint.forward.possibleInputs = function ({data, index}) {
  automata.resetNodesHighlight(this.state.nfa);
  automata.resetEdgesHighlight(this.state.nfa);
  automata.resetNodesHighlight(this.state.dfa);

  const edges = _.flatten(data.transitions.map(e => e.dest.map(dest => ({
    src: e.src.id, char: e.char, dest: dest.id
  }))));

  automata.highlightEdges(this.state.nfa, edges);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `NFA states {${data.dfa_state_contents}} give the possible inputs to follow: {${data.possible_inputs}}`,
      breakpoint: data
    });
  }
};

breakpoint.forward.moveStates = function ({data, index}) {
  automata.resetNodesHighlight(this.state.nfa);

  automata.highlightNodes(this.state.nfa, [data.state.id].concat(data.connected_states.map(s => s.id)));

  let connectedStatesString = `${!data.connected_states.length
          ? `no state: there is no '${data.char}' transition`
          : `{${data.connected_states.map(s => s.id).join(', ')}}`}`;

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `Move action: NFA state ${data.state.id} moves to ${connectedStatesString}`,
      breakpoint: data
    });
  }
};

breakpoint.forward.epsilonClosure = function ({ data, index }) {
  automata.highlightNodes(this.state.nfa, data.output.map(s => s.id), automata.highlightOptions.highlightState[1].color.background);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `ε-closure of NFA states {${data.input.map(s => s.id).join(', ')}}: {${data.output.map(s => s.id).join(', ')}}`,
      breakpoint: data
    });
  }
};

breakpoint.forward.newDfaTransition = function ({ data, index }) {
  const nfaStates = data.dest.states.map(s => s.id).join(', ');

  automata.addNode(this.state.dfa, data.dest);
  automata.updateNodesAttr(this.state.dfa, [{
    id: data.dest.id,
    title: `Corresponding NFA states: ${nfaStates}`
  }]);
  automata.addEdge(this.state.dfa, data.src, data.dest, data.char);

  if (this.refs.actionsHistory) {
    this.refs.actionsHistory.addOrSelect(index, {
      title: `New DFA state ${data.dest.id} formed by NFA states {${nfaStates}}`,
      breakpoint: data
    });
  }
};

/**
 * Visualization states
 */

breakpoint.visualizationStates = {};

breakpoint.visualizationStates.commit = function (cb = null) {
  let { visualizationStates } = this.state;

  visualizationStates.push({
    nfa: {
      nodes: clone(this.state.nfa.nodes),
      edges: clone(this.state.nfa.edges)
    },
    dfa: {
      nodes: clone(this.state.dfa.nodes),
      edges: clone(this.state.dfa.edges)
    }
  });

  this.setState({ visualizationStates }, cb);
};

breakpoint.visualizationStates.rollback = function () {
  let visualizationStates = this.state.visualizationStates || [];

  let visualizationState = visualizationStates.pop();

  const nfaNodes = clone(visualizationState.nfa.nodes);
  const nfaEdges = clone(visualizationState.nfa.edges);
  const dfaNodes = clone(visualizationState.dfa.nodes);
  const dfaEdges = clone(visualizationState.dfa.edges);

  this.state.nfa.instance.setData({
    nodes: nfaNodes,
    edges: nfaEdges
  });

  this.state.dfa.instance.setData({
    nodes: dfaNodes,
    edges: dfaEdges
  });

  this.setState({
    nfa: {
      instance: this.state.nfa.instance,
      nodes: nfaNodes,
      edges: nfaEdges
    },
    dfa: {
      instance: this.state.dfa.instance,
      nodes: dfaNodes,
      edges: dfaEdges
    },
    visualizationStates
  });
};

/**
 * Event handlers
 */

breakpoint.eventHandlers = {};

breakpoint.eventHandlers.visualizeForward = function (b, cb = null) {
  breakpoint.visualizationStates.commit.call(this, () => {
    breakpoint.forward[_.camelCase(b.label)].call(this, {
      label: b.label,
      data: b.data,
      index: this.state.breakpoint.index
    });

    if (cb !== null && _.isFunction(cb)) {
      cb(b);
    }
  });
};

breakpoint.eventHandlers.visualizeBackward = function (b, cb = null) {
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

  if (cb !== null && _.isFunction(cb)) {
    cb(b);
  }
};

breakpoint.eventHandlers.saveVisualization = function () {
  if (this.refs.visualizationControl === undefined) {
    ui.obj.modal.show(this, 'Warning', 'Saving the visualization is not supported.');
    return;
  }

  ui.obj.loader.show(this);

  const arr = misc.range(0, this.state.breakpoint.data.length + 1);
  const doc = new jsPDF('p', 'mm');
  let promises = [];

  this.refs.visualizationControl.breakpoint.forAll(b => {
    promises.push(html2canvas(document.querySelector('.dashboard-card-content')));
  });

  setTimeout(() => {
    Promise.all(promises).then(canvases => {
      canvases.forEach((canvas, index) => {
        let screen = canvas.toDataURL('image/jpeg', 0.5);
        let imgWidth = 210;
        let pageHeight = 295;
        let imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        doc.addImage(screen, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(screen, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.addPage();
      });

      doc.save('download.pdf');

      ui.obj.loader.hide(this);

      /*setTimeout(() => {
        ui.obj.loader.hide(this);
        doc.save('download.pdf');
      }, 10000);*/
    });
  }, 15000);
};
