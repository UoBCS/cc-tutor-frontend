import React, { Component } from 'react';
import { Button, Header, Grid, Segment, Menu, Label } from 'semantic-ui-react';
import VisualizationControl from 'components/VisualizationControl/VisualizationControl';
import VisualizationElement from 'components/VisualizationElement/VisualizationElement';
import api from 'api';
import _ from 'lodash';
import automata from 'utils/automata';
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
      index: -1
    }
  }

  componentWillMount() {
    api.nfaToDfa(this.props.data)
      .then(res => {
        this.setState({
          breakpoint: {
            data: res.data.breakpoints,
            index: -1
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
    visualizeForward: breakpoint => {
      const data = breakpoint.data;
      const index = this.state.breakpoint.index;
      internal.forward[_.camelCase(breakpoint.label)].call(this, { data, index });
    },

    visualizeBackward: breakpoint => {

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
    updateState: (obj, cb) => {
      this.setState(obj, cb);
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
                <Segment>
                  <Label as='a' color='blue' ribbon>Non-deterministic finite automaton</Label>
                  <div id='nfa-viz' style={{ height: 500 }}></div>
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <Label as='a' color='blue' ribbon='right'>Deterministic finite automaton</Label>
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
