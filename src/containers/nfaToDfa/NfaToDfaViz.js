import React, { Component } from 'react';
import { Button, Container, Header, Grid, Segment, Menu, Message } from 'semantic-ui-react';
import api from 'api';
import automata from 'utils/automata';
import objectPath from 'object-path';
import misc from 'utils/misc';

import './NfaToDfaViz.css';

const d3 = window.d3;
const jsnx = window.jsnx;

class NfaToDfaViz extends Component {

  state = {
    nfaObj: new jsnx.DiGraph(),
    dfaObj: new jsnx.DiGraph(),
    nfa: null,
    dfa: null,
    breakpoints: null,
    currentBreakpointsScope: [],
    currentIndexStack: [0],

    vizElements: {
      actionsHistory: []
    }
  }

  componentWillMount() {
    api.nfaToDfa(this.props.data)
      .then(res => {
        this.setState({
          nfa: this.props.data.nfa,
          breakpoints: res.data.breakpoints
        });

        automata.fromData(this.state.nfaObj, this.props.data.nfa);

        this.createAutomaton('nfa');
        this.createAutomaton('dfa');
      })
      .catch(err => {
        console.log(err);
      });
  }

  createAutomaton(type) {
    jsnx.draw(type === 'nfa' ? this.state.nfaObj : this.state.dfaObj, {
      element: `#${type}-viz`,
      layoutAttr: {
        linkDistance: 200,
        friction: 0.9,
        charge: -280,
        gravity: 0.1,
        theta: 0.8
      },
      nodeStyle: {
        fill: '#989898',
        stroke: d => d.data.final ? '#000' : 'none'
      },
      nodeAttr: {
        r: 30,
        id: d => {
          return `${type}-node-${d.node}`; // assign unique ID
        }
      },
      edgeAttr: {
        id: d => {
          let a = `${type}-${d.edge[0]}-${d.data.char.join('-')}-${d.edge[1]}`
          console.log(a);
          return a;
        }
      },
      labelStyle: {
        fill: 'white',
        'font-size': '30px'
      },
      withLabels: true,
      edgeLabels: d => d.data.char.join(', '),
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
  }

  getBreakpointPath = () => {
    let path = '';

    if (this.state.currentBreakpointsScope.length === 0) {
      return this.state.currentIndexStack[this.state.currentIndexStack.length - 1] + '';
    }

    for (var i = 0; i < this.state.currentBreakpointsScope.length; i++) {
      path += this.state.currentIndexStack[i] + '.' + this.state.currentBreakpointsScope[i] + '.'
    }

    path += this.state.currentIndexStack[i];

    return path;
  }

  highlightNodes = (type, nodes) => {
    d3.selectAll(nodes.map(n => `#${type}-node-${n}`).join(', ')).classed('highlight', true);
  }

  highlightEdges = (type, edges) => {
    d3.selectAll(edges.map(e => `#${type}-${e.join('-')}`).join(', ')).classed('highlight', true);
  }

  addToActionsHistory = obj => {
    let vizElements = this.state.vizElements;
    vizElements.actionsHistory.push(obj);
    this.setState({ vizElements });
  }

  breakpointVisualization = breakpoint => {
    switch (breakpoint.label) {
      case 'highlight_initial_nfa_state':
        this.highlightNodes('nfa', [breakpoint.data.state.id]);

        this.addToActionsHistory({
          label: breakpoint.label,
          title: 'Consider the initial NFA state',
          description: ''
        });
        break;

      case 'initial_state_epsilon_closure':
        d3.selectAll('.node').classed('highlight', false);

        let reachableStates = breakpoint.data.reachable_states.map(s => s.id);
        this.highlightNodes('nfa', reachableStates);

        this.addToActionsHistory({
          label: breakpoint.label,
          title: `ε-closure of NFA state ${breakpoint.data.initial.id}: {${reachableStates.join(', ')}}`,
          description: ''
        });
        break;

      case 'initial_dfa_state':
        // TODO: fix resetting just for one type of FA
        d3.selectAll('.node').classed('highlight', false);

        // Highlight NFA states
        let nfaStates = breakpoint.data.states.map(s => s.id);
        this.highlightNodes('nfa', nfaStates);

        // Add DFA state
        this.state.dfaObj.addNode(breakpoint.data.id);
        this.highlightNodes('dfa', [breakpoint.data.id]);

        this.addToActionsHistory({
          label: breakpoint.label,
          title: `Initial DFA state ${breakpoint.data.id} formed by the previous NFA states: {${nfaStates.join(', ')}}`,
          description: ''
        });
        break;

      case 'possible_inputs':
        d3.selectAll('.node').classed('highlight', false);

        this.highlightEdges('nfa', breakpoint.data.transitions.map(e => [e.src.id, e.char, e.dest.id]));

        this.addToActionsHistory({
          label: breakpoint.label,
          title: `NFA states {${breakpoint.data.dfa_state_contents}} give the possible inputs to follow: {${breakpoint.data.possible_inputs}}`,
          description: ''
        });

        break;
    }
  }

  vizControl = {
    handleDirectionBtnClick: direction => {
      return () => {
        console.log(this.state.breakpoints);

        // Forward
        if (direction === 1) {
          let path = this.getBreakpointPath();
          console.log(path);
          let breakpoint = objectPath.get(this.state.breakpoints, path);

          this.breakpointVisualization(breakpoint);

          // Update breakpoint index
          let currentIndexStack = this.state.currentIndexStack;
          currentIndexStack[currentIndexStack.length - 1]++;
          this.setState({ currentIndexStack });
        }

        // Back
        if (direction === -1) {

        }
      };
    },

    handleStepIntoBtnClick: () => {

    }
  }

  render() {
    return (
      <div>
        <Container className='dashboard-content'>
          <Grid>
            <Grid.Column floated='left' width={9}>
              <Header
                as='h1'
                className='light-heading'>
                NFA to DFA visualization
              </Header>
              <p>
                Some nice description right here please.
              </p>
            </Grid.Column>
            <Grid.Column floated='right' width={1}>
              <Button
                circular
                icon='question'
                color='blue'
                style={{ float: 'right' }}/>
              <br style={{ clear: 'both' }}/>
            </Grid.Column>
          </Grid>

          <div className='viz-info'>
            <p className='current-action'>
              { this.state.vizElements.actionsHistory.length ? misc.last(this.state.vizElements.actionsHistory).title : null }
            </p>
          </div>

          <Grid columns={2}>
            <Grid.Column>
              <Segment className='viz-area'>
                <Header as='h3' className='viz-area-title' content='Non-deterministic finite automaton'/>
                <div id='nfa-viz' style={{ height: 500 }}></div>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment className='viz-area'>
                <Header as='h3' className='viz-area-title' content='Deterministic finite automaton'/>
                <div id='dfa-viz' style={{ height: 500 }}></div>
              </Segment>
            </Grid.Column>
          </Grid>

          <div className='viz-controls-panel'>
            <Button.Group>
              <Button
                labelPosition='left'
                icon='left chevron'
                content='Back'
                onClick={this.vizControl.handleDirectionBtnClick(-1)}/>
              <Button icon='check' content='Check answer'/>
              <Button icon='setting' content='Settings'/>
              <Button
                icon='level down'
                content='Step into'
                onClick={this.vizControl.handleStepIntoBtnClick}/>
              <Button
                labelPosition='right'
                icon='right chevron'
                content='Forward'
                onClick={this.vizControl.handleDirectionBtnClick(1)}/>
            </Button.Group>
          </div>
        </Container>

        <Segment inverted style={{ position: 'fixed', right: 0, left: 250, bottom: 0, borderRadius: 0 }}>
          <Menu inverted secondary size='massive'>
            <Menu.Menu style={{ margin: '0 auto' }}>
              <Menu.Item>
                <Button labelPosition='left' icon='left chevron' content='Go back'/>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Segment>
      </div>
    );
  }

}

export default NfaToDfaViz;
