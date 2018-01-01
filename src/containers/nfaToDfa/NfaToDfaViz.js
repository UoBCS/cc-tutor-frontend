import React, { Component } from 'react';
import { Button, Container, Header, Grid, Segment, Menu, Message } from 'semantic-ui-react';
import VisualizationControl from 'components/VisualizationControl';
import VisualizationElement from 'components/VisualizationElement/VisualizationElement';
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

    breakpoint: {
      data: null,
      scopeStack: [],
      indexStack: [0]
    },

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
        this.setState({
          breakpoint: {
            data: res.data.breakpoints,
            scopeStack: [],
            indexStack: [0]
          }
        });
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
        instance: this.init.createAutomaton('nfa', nfaData, {}),
        nodes: nfaData.nodes,
        edges: nfaData.edges
      },

      dfa: {
        instance: this.init.createAutomaton('dfa', dfaData, {}),
        nodes: dfaData.nodes,
        edges: dfaData.edges
      }
    });
  }

  init = {
    createAutomaton: (type, data, options) => {
      return new vis.Network(document.getElementById(`${type}-viz`), data, options);
    }
  }

  breakpoint = {
    visualize: breakpoint => {
      switch (breakpoint.label) {
        case 'highlight_initial_nfa_state':
          automata.highlightNodes(this.state.nfa, [breakpoint.data.state.id]);

          this.vizElements.addToActionsHistory({
            label: breakpoint.label,
            title: 'Consider the initial NFA state',
            description: ''
          });
          break;

        case 'initial_state_epsilon_closure':
          automata.resetNodesHighlight(this.state.nfa);

          let reachableStates = breakpoint.data.reachable_states.map(s => s.id);
          automata.highlightNodes(this.state.nfa, reachableStates);

          this.vizElements.addToActionsHistory({
            label: breakpoint.label,
            title: `ε-closure of NFA state ${breakpoint.data.initial.id}: {${reachableStates.join(', ')}}`,
            description: ''
          });
          break;

        case 'initial_dfa_state':
          automata.resetNodesHighlight(this.state.nfa);

          // Highlight NFA states
          let nfaStates = breakpoint.data.states.map(s => s.id);
          automata.highlightNodes(this.state.nfa, nfaStates);

          // Add DFA state
          automata.addNode(this.state.dfa, breakpoint.data.id);
          automata.highlightNodes(this.state.dfa, [breakpoint.data.id]);

          this.vizElements.addToActionsHistory({
            label: breakpoint.label,
            title: `Initial DFA state ${breakpoint.data.id} formed by the previous NFA states: {${nfaStates.join(', ')}}`,
            description: ''
          });
          break;

        case 'possible_inputs':
          automata.resetNodesHighlight(this.state.nfa);

          automata.highlightEdges(this.state.nfa, breakpoint.data.transitions.map(e => ({
            src: e.src.id,
            char: e.char,
            dest: e.dest.id
          })));

          this.vizElements.addToActionsHistory({
            label: breakpoint.label,
            title: `NFA states {${breakpoint.data.dfa_state_contents}} give the possible inputs to follow: {${breakpoint.data.possible_inputs}}`,
            description: ''
          });

          break;
      }
    }
  }

  vizElements = {
    addToActionsHistory: obj => {
      let vizElements = this.state.vizElements;
      vizElements.actionsHistory.push(obj);
      this.setState({ vizElements });
    }
  }

  helpers = {
    updateState: obj => {
      this.setState(obj);
    }
  }

  addToActionsHistory = obj => {
    let vizElements = this.state.vizElements;
    vizElements.actionsHistory.push(obj);
    this.setState({ vizElements });
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

          <VisualizationElement.ActionsHistory
            actions={this.state.vizElements.actionsHistory}
            updateState={this.helpers.updateState}/>

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

          <VisualizationControl
            active
            breakpoint={this.state.breakpoint}
            visualizeBreakpoint={this.breakpoint.visualize}
            updateState={this.helpers.updateState}/>
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
