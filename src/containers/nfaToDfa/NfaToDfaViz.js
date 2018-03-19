import React, { Component } from 'react';
import { Button, Header, Icon, Grid, Segment, Menu, Label } from 'semantic-ui-react';
import VisualizationControl from 'components/VisualizationControl/VisualizationControl';
import VisualizationElement from 'components/VisualizationElement/VisualizationElement';
import Window from 'components/Window/Window';
import api from 'api';
import clone from 'clone';
import _ from 'lodash';
import automata from 'utils/automata';
import { breakpoint } from './breakpoint';
import globalBreakpointProcessor from 'utils/globalBreakpointProcessor';
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

    visualizationStates: [],

    ui: clone(ui.state)
  }

  eventHandlers = {
    backClick: () => {
      this.props.windowChangeHandler('input');
    }
  }

  componentWillMount() {
    ui.obj.loader.show(this);

    globalBreakpointProcessor.initialize(breakpoint);

    let data = clone(this.props.data);
    misc.changeKey(data, 'fa', 'nfa');

    api.nfaToDfa(data)
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
    this.setState({
      nfa: automata.visDataFormat('nfa-viz', this.props.data.fa),
      dfa: automata.createEmpty('dfa-viz')
    });
  }

  render() {
    return (
      <div className='dashboard-card'>
        {ui.obj.modal.render(this)}

        {ui.obj.loader.render(this)}

        {ui.obj.toast.render(this)}

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
              <Button
                circular
                icon='question'
                color='blue'
                style={{ float: 'right' }}/>
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
            ref='visualizationControl'
            active
            breakpoint={this.state.breakpoint}
            visualizeBreakpointForward={globalBreakpointProcessor.eventHandlers.visualizeForward().bind(this)}
            visualizeBreakpointBackward={globalBreakpointProcessor.eventHandlers.visualizeBackward().bind(this)}
            saveVisualizationHandler={globalBreakpointProcessor.eventHandlers.saveVisualization().bind(this)}
            updateState={misc.updateState.bind(this)}/>
        </div>

        <div className='dashboard-card-footer'>
          <Button animated onClick={this.eventHandlers.backClick}>
            <Button.Content visible>Back</Button.Content>
            <Button.Content hidden>
              <Icon name='left arrow' />
            </Button.Content>
          </Button>
        </div>
      </div>
    );
  }

}
