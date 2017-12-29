const automata = {};
const jsnx = window.jsnx;

automata.fromData = (fa, data) => {
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
}

export default automata;
