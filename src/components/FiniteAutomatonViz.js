import React, { Component } from 'react';
//import * as d3 from 'd3';

export default class FiniteAutomatonViz extends Component {
  state = {
    automaton: new window.jsnx.DiGraph()
  }

  componentDidMount() {
    window.jsnx.draw(this.state.automaton, {
      element: '#fa-viz',
      layoutAttr: {
        linkDistance: 200
      },
      nodeStyle: {
        fill: '#000',
        stroke: function (d) {
          return d.data.final ? '#f00' : '#000';
        }
      },
      nodeAttr: {
        r: 30
      },
      labelStyle: {
        fill: 'white',
        'font-size': '30px'
      },
      withLabels: true,
      edgeLabels: 'char',
      edgeStyle: {
        fill: '#676767',
        'stroke-width': 10,
      },
      edgeLabelStyle: {
        'font-size': '20px'
      },
      withEdgeLabels: true,
      stickyDrag: true
    }, true);

    this.updateAutomaton();
  }

  componentDidUpdate() {
    this.updateAutomaton();
  }

  updateAutomaton = () => {
    let edge = this.props.data.edge;

    if (edge.source && edge.target) {
      this.state.automaton.addNode(edge.source.id, {
        final: edge.source.final
      });
      this.state.automaton.addNode(edge.target.id, {
        final: edge.target.final
      })

      this.state.automaton.addEdge(edge.source.id, edge.target.id, {
        char: edge.char
      });
    }
  }

  render() {
    return <div id='fa-viz' style={{ width: 600, height: 600 }}></div>
  }
}
