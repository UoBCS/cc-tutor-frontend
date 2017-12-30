import vis from 'vis';

const automata = {};
const jsnx = window.jsnx;

/*automata.fromData = (fa, data) => {
  data.forEach(entry => {
    fa.addNode(entry.src.id, {
      final: entry.src.final
    });

    fa.addNode(entry.dest.id, {
      final: entry.dest.final
    })

    if (!fa.hasEdge(entry.src.id, entry.dest.id)) {
      fa.addEdge(entry.src.id, entry.dest.id, {
        char: [entry.char]
      });
    } else {
      let char = fa.getEdgeData(entry.src.id, entry.dest.id).char;
      char.push(entry.char);

      fa.addEdge(entry.src.id, entry.dest.id, { char });
    }
  });
};*/

automata.visDataFormat = (data) => {
  let nodesData = new Set();

  data.forEach(e => {
    nodesData.add(e.src.id);
    nodesData.add(e.dest.id);
  });

  let nodes = new vis.DataSet([...nodesData].map(n => ({ id: n, label: '' + n })));

  let edgesData = [];

  data.forEach(e => {
    edgesData.push({
      from: e.src.id,
      to: e.dest.id,
      arrows:'to',
      label: e.char,
      font: {align: 'top'}
    });
  });

  let edges = new vis.DataSet(edgesData);

  return { nodes, edges };
};

automata.addEdge = (fa, n1, n2, transition) => {
  let n1o = fa.nodes.get(n1);
  let n2o = fa.nodes.get(n2);

  if (n1o === null) {
    fa.nodes.add({ id: n1, label: '' + n1 });
  }

  if (n2o === null) {
    fa.nodes.add({ id: n2, label: '' + n2 });
  }

  fa.edges.add({
    from: n1,
    to: n2,
    arrows: 'to',
    label: transition,
    font: {align: 'top'}
  });
};

export default automata;
