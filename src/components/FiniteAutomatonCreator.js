import React, { Component } from 'react';
import automata from 'utils/automata';
import vis from 'vis';

import 'vis/dist/vis-network.min.css';
import './FiniteAutomatonCreator.css';

class FiniteAutomatonCreator extends Component {

  nodes = new vis.DataSet();
  edges = new vis.DataSet();
  fa = null;
  currentNodeIndex = 0;

  componentDidMount() {
    this.createAutomaton();
  }

  getFiniteAutomaton = () => {
    return automata.fromVis(this.edges, this.nodes);
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
            data.label = prompt('Please enter the transition character:', 'ε');
            data.font = {align: 'top'};

            if (data.from === data.to) {
              if (window.confirm('Do you want to connect the state to itself?')) {
                cb(data);
              }
            }
            else {
              cb(data);
            }
          },
          deleteNode: true,
          deleteEdge: true,
          editNode: (data, cb) => {
            const final = prompt('Is this state final?').toLowerCase() === 'yes';

            const faObj = {
              instance: this.fa,
              edges: this.edges,
              nodes: this.nodes
            };

            automata.updateNodesAttr(faObj, [{id: data.id, final }]);
            automata.resetNodesHighlight(faObj);

            cb(data);
          }
        }
      }
    );
  }

  render() {
    return (
      <div
        id={this.props.containerElement}
        className='fa-creator-wrapper'
        hidden={this.props.hidden}
        style={{ height: 550 }}>
      </div>
    );
  }

}

export default FiniteAutomatonCreator;
