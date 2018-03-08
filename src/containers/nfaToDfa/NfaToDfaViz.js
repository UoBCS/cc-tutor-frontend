import React, { Component } from 'react';
import { Button, Header, Grid, Segment, Menu, Label } from 'semantic-ui-react';
import VisualizationControl from 'components/VisualizationControl/VisualizationControl';
import VisualizationElement from 'components/VisualizationElement/VisualizationElement';
import Window from 'components/Window/Window';
import api from 'api';
import clone from 'clone';
import _ from 'lodash';
import automata from 'utils/automata';
import breakpoint from './breakpoint';
import userInteraction from './userInteraction';
import misc from 'utils/misc';
import ui from 'utils/ui';

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
    },

    ui: clone(ui.state)
  }

  componentWillMount() {
    ui.obj.loader.show(this);

    api.nfaToDfa(this.props.data)
      .then(res => {
        ui.obj.loader.hide(this);

        this.setState({
          breakpoint: {
            data: res.data.breakpoints,
            index: -1
          }
        });
      })
      .catch(err => {
        ui.obj.loader.hide(this);
        ui.obj.message.showErrorFromData(this, err);
      });
  }

  componentDidMount() {
    const dfaOptions = {
      manipulation: {
        enabled: true,
        initiallyActive: true,
        addNode: userInteraction.dfa.addNode.bind(this),
        addEdge: userInteraction.dfa.addEdge.bind(this)
      }
    };

    this.setState({
      nfa: automata.visDataFormat('nfa-viz', this.props.data.nfa),
      dfa: automata.createEmpty('dfa-viz', dfaOptions)
    });
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
      <div className='dashboard-card'>
        {ui.obj.modal.render(this)}

        {ui.obj.loader.render(this)}

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
          {ui.obj.message.render(this)}

          <VisualizationElement.ActionsHistory ref='actionsHistory'/>

          <Grid columns={2}>
            <Grid.Column>
              <Window title='Non-deterministic finite automaton' titleColor='blue'>
                <div id='nfa-viz' style={{ height: 500 }}></div>
              </Window>
            </Grid.Column>
            <Grid.Column>
              <Window title='Deterministic finite automaton' titleColor='blue'>
                <div id='dfa-viz' style={{ height: 500 }}></div>
              </Window>
            </Grid.Column>
          </Grid>

          <VisualizationControl
            active
            breakpoint={this.state.breakpoint}
            visualizeBreakpointForward={breakpoint.eventHandlers.visualizeForward.bind(this)}
            visualizeBreakpointBackward={breakpoint.eventHandlers.visualizeBackward.bind(this)}
            checkAnswerHandler={userInteraction.checkAnswer.bind(this)}
            updateState={misc.updateState.bind(this)}/>
        </div>

        <div className='dashboard-card-footer'>
          <Button
            labelPosition='left'
            icon='left chevron'
            content='Back'
            onClick={this.eventHandlers.handleBackBtnClick}/>
        </div>
      </div>
    );
  }

}
