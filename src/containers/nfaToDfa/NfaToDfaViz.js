import React, { Component } from 'react';
import { Button, Container, Header, Grid, Segment, Menu, Message } from 'semantic-ui-react';
import vis from 'vis';
import api from 'api';
import automata from 'utils/automata';
import objectPath from 'object-path';
import misc from 'utils/misc';

import './NfaToDfaViz.css';

class NfaToDfaViz extends Component {

  state = {
    nfa: {
      instance: null,
      nodes: null,
      edges: null
    },

    dfa: {
     instance: null,
     nodes: null,
     edges: null
    },

    breakpoints: null,
    currentBreakpointsScope: [],
    currentIndexStack: [0],

    vizElements: {
      actionsHistory: []
    }
  }

  vizConfig = {
    nodeColor: '#000'
  }

  componentWillMount() {
    api.nfaToDfa(this.props.data)
      .then(res => {
        this.setState({ breakpoints: res.data.breakpoints });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    let nfaData = automata.visDataFormat(this.props.data.nfa);
    let dfaData = {
      nodes: new vis.DataSet(),
      edges: new vis.DataSet()
    };

    this.setState({
      nfa: {
        instance: this.createAutomaton('nfa', nfaData, {}),
        nodes: nfaData.nodes,
        edges: nfaData.edges
      },

      dfa: {
        instance: this.createAutomaton('dfa', dfaData, {}),
        nodes: dfaData.nodes,
        edges: dfaData.edges
      }
    });
  }

  createAutomaton = (type, data, options) => {
    return new vis.Network(document.getElementById(`${type}-viz`), data, options);
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

  highlightNodes = (type, nodes, color = '#f00') => {
    this.state[type].nodes.update(nodes.map(n => ({id: n, color: {background: color}})));
  }

  resetNodesHighlight = type => {

  }

  highlightEdges = (type, edges, color = '#f00') => {
    this.state[type].edges.update(edges.map(e => ({ char: e.char, color: { color } })));
  }

  resetEdgesHighlight = type => {

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
        this.resetNodesHighlight('nfa');

        let reachableStates = breakpoint.data.reachable_states.map(s => s.id);
        this.highlightNodes('nfa', reachableStates);

        this.addToActionsHistory({
          label: breakpoint.label,
          title: `ε-closure of NFA state ${breakpoint.data.initial.id}: {${reachableStates.join(', ')}}`,
          description: ''
        });
        break;

      case 'initial_dfa_state':
        this.resetNodesHighlight('nfa');

        // Highlight NFA states
        let nfaStates = breakpoint.data.states.map(s => s.id);
        this.highlightNodes('nfa', nfaStates);

        // Add DFA state
        this.state.dfa.nodes.add({ id: breakpoint.data.id, label: '' + breakpoint.data.id });
        this.highlightNodes('dfa', [breakpoint.data.id]);

        this.addToActionsHistory({
          label: breakpoint.label,
          title: `Initial DFA state ${breakpoint.data.id} formed by the previous NFA states: {${nfaStates.join(', ')}}`,
          description: ''
        });
        break;

      case 'possible_inputs':
        this.resetNodesHighlight('nfa');

        this.highlightEdges('nfa', breakpoint.data.transitions.map(e => ({
          src: e.src.id,
          char: e.char,
          dest: e.dest.id
        })));

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
