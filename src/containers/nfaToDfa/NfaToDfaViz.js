import React, { Component } from 'react';
import { Button, Container, Header, Grid, Segment, Menu, Message } from 'semantic-ui-react';
import VisualizationControl from 'components/VisualizationControl';
import VisualizationElement from 'components/VisualizationElement/VisualizationElement';
import vis from 'vis';
import api from 'api';
import automata from 'utils/automata';
import objectPath from 'object-path';
import misc from 'utils/misc';
import internal from './internal';

export default class NfaToDfaViz extends Component {

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
    }
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
    this.setState({
      nfa: automata.visDataFormat('nfa-viz', this.props.data.nfa),
      dfa: automata.createEmpty('dfa-viz')
    });
  }

  breakpoint = {
    visualizeForward: (breakpoint, index) => {
      let data = breakpoint.data;

      console.log(breakpoint);

      switch (breakpoint.label) {
        case 'highlight_initial_nfa_state':
          internal.forward.highlightInitialNfaState.call(this, { data, index });
          break;

        case 'initial_state_epsilon_closure':
          internal.forward.initialStateEpsilonClosure.call(this, { data, index });
          break;

        case 'initial_dfa_state':
          internal.forward.initialDfaState.call(this, { data, index });
          break;

        case 'possible_inputs':
          internal.forward.possibleInputs.call(this, { data, index });
          break;

        case 'move_states':
          internal.forward.moveStates.call(this, { data, index });
          break;

        case 'epsilon_closure':
          internal.forward.epsilonClosure.call(this, { data, index });
          break;

        case 'new_dfa_transition':
          internal.forward.newDfaTransition.call(this, { data, index });
          break;

        default:

          break;
      }
    },

    visualizeBackward: (breakpoint, index) => {

    }
  }

  userInteraction = {
    handleCheckAnswerClick: () => {

    }
  }

  eventHandlers = {
    handleBackBtnClick: () => {
      this.props.windowChangeHandler('input');
    }
  }

  helpers = {
    updateState: obj => {
      this.setState(obj);
    }
  }

  render() {
    return (
      <div>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>
            <Grid className='viz-heading'>
              <Grid.Column floated='left' width={9} className='viz-heading-left'>
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
                <Button.Group basic size='small' style={{ float: 'right' }}>
                  <Button icon='settings' />
                  <Button icon='question' />
                </Button.Group>
                <br style={{ clear: 'both' }}/>
              </Grid.Column>
            </Grid>
          </div>

          <div className='dashboard-card-content'>
            <VisualizationElement.ActionsHistory ref='actionsHistory'/>

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
              visualizeBreakpointForward={this.breakpoint.visualizeForward}
              visualizeBreakpointBackward={this.breakpoint.visualizeBackward}
              checkAnswerHandler={this.userInteraction.handleCheckAnswerClick}
              updateState={this.helpers.updateState}/>

            <Menu secondary>
              <Menu.Menu style={{ margin: '0 auto' }}>
                <Menu.Item>
                  <Button labelPosition='left' icon='left chevron' content='Go back' onClick={this.eventHandlers.handleBackBtnClick}/>
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </div>
        </div>
      </div>
    );
  }

}
