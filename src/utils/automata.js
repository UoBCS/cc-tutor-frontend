import vis from 'vis';
import _ from 'lodash';

const automata = {};

const defaultOptions = {
  nodes: {
    color: {
      background: '#fafafa',
      border: '#000'
    },

    shape: 'circle',

    margin: {
      top: 7,
      left: 10,
      right: 7,
      bottom: 7
    },

    font: {
      face: 'monospace',
      align: 'left'
    }
  },

  edges: {
    color: {
      color: '#000'
    },

    width: 1,

    font: {
      face: 'monospace'
    }
  },

  interaction: {
    navigationButtons: true
  }
};

const highlightOptions = {
  finalState: {
    color: {
      background: '#f00'
    }
  },

  highlightState: [
    {
      color: { background: '#44ff00' }
    },

    {
      color: { background: '#f0ff00' }
    }
  ],

  highlightTransition: [
    {
      color: { color: '#44ff00' },
      width: 5
    }
  ]
};

automata.defaultOptions = defaultOptions;
automata.highlightOptions = highlightOptions;
automata.EPSILON = 'ε';

automata.createEmpty = (container, options = {}) => {
  const nodes = new vis.DataSet();
  const edges = new vis.DataSet();

  return {
    instance: new vis.Network(document.getElementById(container), { nodes, edges }, _.defaultsDeep(options, defaultOptions)),
    nodes,
    edges
  };
};

automata.visDataFormat = (container, data, options = {}) => {
  let nodesData = new Set();

  data.forEach(e => {
    nodesData.add(JSON.stringify(e.src));
    nodesData.add(JSON.stringify(e.dest));
  });

  let nodes = new vis.DataSet([...nodesData].map(node => {
    const n = JSON.parse(node);
    return {
      id: n.id,
      label: '' + n.id,
      color: {background: n.final ? highlightOptions.finalState.color.background : null},
      final: n.final,
      data: n.data
    }
  }));

  let edgesData = [];

  data.forEach(e => {
    edgesData.push({
      id: `${e.src.id}-${e.char}-${e.dest.id}`,
      from: e.src.id,
      to: e.dest.id,
      arrows:'to',
      label: e.char,
      font: {align: 'top'}
    });
  });

  let edges = new vis.DataSet(edgesData);

  return {
    instance: new vis.Network(document.getElementById(container), { nodes, edges }, _.defaultsDeep(options, defaultOptions)),
    nodes,
    edges
  };
};

automata.fromVis = edges => {
  let nfa = [];

  edges.forEach(e => {
    nfa.push({
      src: {
        id: e.from,
        final: false
      },
      char: e.label,
      dest: {
        id: e.to,
        final: false
      }
    });
  });

  return nfa;
};

automata.setNodeData = (fa, data, fn) => {
  fa.instance.on('doubleClick', params => {
    let nodeId = params.nodes[0];

    for (const n of data) {
      const nodeData = fa.nodes.get(nodeId).data || {renderData: false};

      if (n.id === nodeId) {
        nodeData.renderData = !nodeData.renderData;
        fa.nodes.update({
          id: nodeId,
          label: nodeData.renderData ? fn(n) : nodeId + '',
          data: nodeData
        });
        break;
      }
    }
  });
};

automata.addNode = (fa, n) => {
  if (n.id === undefined) {
    n = {
      id: n,
      final: false
    };
  }

  fa.nodes.add({
    id: n.id,
    label: '' + n.id,
    color: {
      background: n.final ? highlightOptions.finalState.color.background : null
    },
    final: n.final
  });
};

automata.removeNode = (fa, n) => {
  fa.nodes.remove(n);
};

automata.highlightNodes = (fa, nodes, color = highlightOptions.highlightState[0].color.background) => {
  if (nodes.length > 0) {
    fa.nodes.update(nodes.map(n => ({id: n, color: {background: color}})));
  }
}

automata.resetNodesHighlight = fa => {
  const nodes = fa.nodes.getIds();

  fa.nodes.update(nodes.map(n => {
    const node = fa.nodes.get(n);

    return {
      id: n,
      color: {
        background: node.final
                    ? highlightOptions.finalState.color.background
                    : defaultOptions.nodes.color.background
      }
    };
  }));
};

automata.updateNodesAttr = (fa, nodes) => {
  fa.nodes.update(nodes.map(n => {
    let obj = { id: n.id };
    Object.keys(n).forEach(k => {
      if (k !== 'id') {
        obj[k] = n[k];
      }
    });
    return obj;
  }));
};

automata.addEdge = (fa, n1, n2, transition) => {
  if (n1.id === undefined) {
    n1 = {
      id: n1,
      final: false
    };
  }

  if (n2.id === undefined) {
    n2 = {
      id: n2,
      final: false
    };
  }

  let n1o = fa.nodes.get(n1.id);
  let n2o = fa.nodes.get(n2.id);

  if (n1o === null) {
    fa.nodes.add({
      id: n1.id,
      label: '' + n1.id,
      color: {background: n1.final ? highlightOptions.finalState.color.background : null},
      final: n1.final
    });
  }

  if (n2o === null) {
    fa.nodes.add({
      id: n2.id,
      label: '' + n2.id,
      color: {background: n2.final ? highlightOptions.finalState.color.background : null},
      final: n2.final
    });
  }

  fa.edges.add({
    id: `${n1.id}-${transition}-${n2.id}`,
    from: n1.id,
    to: n2.id,
    arrows: 'to',
    label: transition,
    font: {align: 'top'}
  });
};

automata.removeEdge = (fa, n1, n2, transition, removeNodesIfNotConnected = true) => {
  if (n1.id !== undefined) {
    n1 = n1.id;
  }

  if (n2.id !== undefined) {
    n2 = n2.id;
  }

  fa.edges.remove(`${n1}-${transition}-${n2}`);

  if (removeNodesIfNotConnected) {
    let connectedNodes = new Set();
    fa.edges.forEach(e => {
      connectedNodes.add(e.from);
      connectedNodes.add(e.to);
    });

    if (!connectedNodes.has(n1)) {
      fa.nodes.remove(n1);
    }

    if (!connectedNodes.has(n2)) {
      fa.nodes.remove(n2);
    }
  }
};

automata.highlightEdges = (fa, edges, color = highlightOptions.highlightTransition[0].color.color) => {
  if (edges.length > 0) {
    fa.edges.update(edges.map(e => ({
      id: `${e.src}-${e.char}-${e.dest}`,
      color: { color },
      width: highlightOptions.highlightTransition[0].width
    })));
  }
};

automata.resetEdgesHighlight = fa => {
  const edges = fa.edges.getIds();

  fa.edges.update(edges.map(n => {
    const edge = fa.edges.get(n);

    return {
      id: edge.id,
      color: { color: defaultOptions.edges.color.color },
      width: defaultOptions.edges.width
    };
  }));
};


automata.isConnected = (fa, n) => {
  let connectedNodes = new Set();

  fa.edges.forEach(e => {
    connectedNodes.add(e.from);
    connectedNodes.add(e.to);
  });

  return connectedNodes.has(n);
};

export default automata;
