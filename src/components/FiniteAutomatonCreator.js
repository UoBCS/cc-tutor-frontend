import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

const d3 = window.d3;
const jsnx = window.jsnx;

class FiniteAutomatonCreator extends Component {

  fa = new jsnx.MultiDiGraph();
  currentNodeIndex = 0;
  selectedNodeSrc = null;

  componentDidMount() {
    this.createAutomaton();
  }

  createAutomaton = () => {
    jsnx.draw(this.fa, {
      element: `#${this.props.containerElement}`,
      layoutAttr: {
        linkDistance: 200,
        friction: 0.9,
        charge: -280,
        gravity: 0.1,
        theta: 0.8
      },
      nodeStyle: {
        fill: '#000',
        stroke: d => {
          return d.data.final ? '#f00' : '#000';
        }
      },
      nodeAttr: {
        r: 30,
        id: d => {
          return `node-${d.node}`; // assign unique ID
        }
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
        'font-size': '30px'
      },
      withEdgeLabels: true,
      stickyDrag: true
    }, true);

    d3.selectAll('.node').on('click', d => {
      this.highlightNode(d.node);
    });

  }

  highlightNode = d => {
    const el = d3.select(`#node-${d.node}`);

    if (el.attr('highlighted') !== null && el.attr('highlighted') === 'true') {
      el.style('fill', '#000').attr('highlighted', false);
    } else {
      el.style('fill', '#f00').attr('highlighted', true);
    }

    if (this.selectedNodeSrc === null) {
      this.selectedNodeSrc = d.node;
    } else {
      this.fa.addEdge(this.selectedNodeSrc, d.node, { char: 'ε' });

      // Reset
      el.style('fill', '#000').attr('highlighted', false);
      d3.select(`#node-${this.selectedNodeSrc}`).style('fill', '#000').attr('highlighted', false);
      this.selectedNodeSrc = null;
    }
  }

  handleAddNodeClick = () => {
    this.fa.addNode(this.currentNodeIndex);

    d3.select(`#node-${this.currentNodeIndex}`).on('click', this.highlightNode);

    this.currentNodeIndex++;
  }

  handleRemoveNodeClick = () => {
    if (this.selectedNodeSrc !== null) {
      this.fa.removeNode(this.selectedNodeSrc);
      this.selectedNodeSrc = null;
    }
  }

  render() {
    return (
      <div>
        <div id={this.props.containerElement}
              style={{ height: 550, width: 800 }}
              onClick={this.handleInputAreaClick}>
        </div>

        <div>
          <Button positive onClick={this.handleAddNodeClick} icon='plus' labelPosition='left' content='Add node'/>
          <Button negative onClick={this.handleRemoveNodeClick} icon='x' labelPosition='left' content='Cancel selected'/>
          <Button>Three</Button>
        </div>
      </div>
    );
  }

}

export default FiniteAutomatonCreator;
