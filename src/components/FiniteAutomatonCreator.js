import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
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

  componentDidUpdate() {
    if (this.props.finished) {
      this.props.onFinishEditing(this.edges);
    }
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
