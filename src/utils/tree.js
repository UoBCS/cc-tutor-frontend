import vis from 'vis';
import objectPath from 'object-path';
import visUtils from './visUtils';

const tree = {};

const traverseTreeTopDown = (node, count, level, nodes, edges, path) => {
  if (nodes.get(count) === null) {
    nodes.add({
      id: count,
      label: objectPath.get(node, path),
      data: node.data,
      level
    });
  }

  if (!node.children || node.children.length === 0) {
    return count;
  }

  const parentCount = count;
  for (const child of node.children) {
    edges.add({
      from: parentCount,
      to: count + 1
    });

    count = traverseTreeTopDown(child, count + 1, level + 1, nodes, edges, path);
  }

  return count;
};

const traverseTreeBottomUp = (data, nodes, edges, path) => {
  let count = 0;

  for (let node of data) {
    traverseTreeTopDown(node, count++, 0, nodes, edges, path);
  }
};

const astToTreeFormat = (data, key, output) => {
  output.name = key;
  output.children = [];

  Object.keys(data[key]).forEach(k => {
    if (k.startsWith('_')) {
      output.data = data[key][k];
    } else {
      let d = {};
      astToTreeFormat(data[key], k, d);
      output.children.push(d);
    }
  });
};

tree.options = {
  edges: {
    smooth: {
      type: 'cubicBezier',
      forceDirection: 'vertical',
      roundness: 0.4
    }
  },
  nodes: {
    font: {
      face: 'monospace'
    }
  },
  layout: {
    hierarchical: {
      direction: 'UD'
    }
  },
  physics: false,
  interaction: {
    navigationButtons: true
  }
};

tree.visUtils = visUtils;

tree.visDataFormat = (container, data, path = 'name', topDown = true) => {
  let nodes = new vis.DataSet();
  let edges = new vis.DataSet();

  if (topDown) {
    traverseTreeTopDown(data, 0, 0, nodes, edges, path);
  } else {
    traverseTreeBottomUp(data, nodes, edges, path);
  }

  return {
    instance: new vis.Network(document.getElementById(container), { nodes, edges }, tree.options),
    nodes,
    edges
  };
};

tree.fromAst = (container, data) => {
  let nodes = new vis.DataSet();
  let edges = new vis.DataSet();
  let outputData = {};

  astToTreeFormat({ root: data }, 'root', outputData);
  traverseTreeTopDown(outputData, 0, 0, nodes, edges, 'name');

  return {
    instance: new vis.Network(document.getElementById(container), { nodes, edges }, tree.options),
    nodes,
    edges
  };
}

export default tree;
