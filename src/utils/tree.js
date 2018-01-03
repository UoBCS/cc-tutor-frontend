import vis from 'vis';

const tree = {};

const traverseTree = (node, count, level, nodes, edges) => {
  if (nodes.get(count) === null) {
    nodes.add({
      id: count,
      label: node.name,
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

    count = traverseTree(child, count + 1, level + 1, nodes, edges);
  }

  return count;
}

tree.visDataFormat = (container, data) => {
  let nodes = new vis.DataSet();
  let edges = new vis.DataSet();

  traverseTree(data, 0, 0, nodes, edges);

  const options = {
    edges: {
      smooth: {
        type: 'cubicBezier',
        forceDirection: 'vertical',
        roundness: 0.4
      }
    },
    layout: {
      hierarchical: {
        direction: 'UD'
      }
    },
    physics: false
  };

  return {
    instance: new vis.Network(document.getElementById(container), { nodes, edges }, options),
    nodes,
    edges
  };
};

export default tree;
