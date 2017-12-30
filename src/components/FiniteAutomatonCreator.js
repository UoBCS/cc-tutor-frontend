import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import vis from 'vis';
import 'vis/dist/vis-network.min.css';

class FiniteAutomatonCreator extends Component {

  nodes = new vis.DataSet();
  edges = new vis.DataSet();
  fa = null;
  currentNodeIndex = 0;

  componentDidMount() {
    this.createAutomaton();
  }

  createAutomaton = () => {
    this.fa = new vis.Network(
      document.getElementById(this.props.containerElement),
      {nodes: this.nodes, edges: this.edges},
      {
        manipulation: {
          enabled: true,
          initiallyActive: true,
          addNode: (data, cb) => {
            data.id = this.currentNodeIndex;
            data.label = this.currentNodeIndex + '';
            this.currentNodeIndex++;
            cb(data);
          },
          addEdge: function (data, cb) {
            data.arrows = 'to';
            data.label = 'test';
            data.font = {align: 'top'};

            if (data.from === data.to) {
              if (window.confirm('Do you want to connect the state to itself?')) {
                cb(data);
              }
            }
            else {
              cb(data);
            }
          }
        }
      }
    );
  }

  highlightNode = () => {

  }

  render() {
    return <div id={this.props.containerElement} style={{ height: 550, width: 800 }}></div>;
  }

}

export default FiniteAutomatonCreator;
