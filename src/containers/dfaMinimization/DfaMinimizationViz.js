import React, { Component } from 'react';
import { Button, Header, Icon, Grid, Segment, Menu, Label } from 'semantic-ui-react';
import DiagTable from 'components/DiagTable/DiagTable';
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
import RGL, { WidthProvider } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);

/*
{
  "states": [
    {"id": 0, "final": false},
    {"id": 1, "final": true},
    {"id": 2, "final": true}
  ],

  "transitions": [
    {"src": 0, "char": "a", "dest": 1},
    {"src": 0, "char": "b", "dest": 2}
  ]
}
*/

export default class DfaMinimizationViz extends Component {

  state = {
    dfa: {
      instance: null,
      nodes: null,
      edges: null
    },

    minDfa: {
     instance: null,
     nodes: null,
     edges: null
    },

    table: null,

    breakpoint: {
      data: null,
      index: -1
    },

    dashboardLayout: [
      {i: 'history', x: 0, y: 0, w: 6, h: 4, minH: 4},
      {i: 'dfa', x: 0, y: 1, w: 2, h: 14, minH: 14},
      {i: 'minDfa', x: 2, y: 1, w: 2, h: 14, minH: 14},
      {i: 'diagTable', x: 4, y: 1, w: 2, h: 14}
    ],

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
    misc.changeKey(data, 'fa', 'dfa');

    api.minimizeDfa(data)
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
      dfa: automata.visDataFormat('dfa-viz', this.props.data.fa),
      minDfa: automata.createEmpty('min-dfa-viz')
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
                DFA minimization visualization
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

          <ReactGridLayout
            className='layout'
            layout={this.state.dashboardLayout}
            cols={6}
            rowHeight={30}
            items={4}
            draggableHandle='.rgl-handle'>

            <div key='history'>
              <Window title='Actions history'>
                <VisualizationElement.ActionsHistory ref='actionsHistory'/>
              </Window>
            </div>

            <div key='dfa'>
              <Window title='Non-minimized DFA' titleColor='blue'>
                <div id='dfa-viz' style={{ height: 500 }}></div>
              </Window>
            </div>

            <div key='minDfa'>
              <Window title='Minimized DFA' titleColor='blue'>
                <div id='min-dfa-viz' style={{ height: 500 }}></div>
              </Window>
            </div>

            <div key='diagTable'>
              <Window title='Table' titleColor='blue'>
                <DiagTable data={this.state.table} />
              </Window>
            </div>
          </ReactGridLayout>

          <VisualizationControl
            active
            breakpoint={this.state.breakpoint}
            visualizeBreakpointForward={globalBreakpointProcessor.eventHandlers.visualizeForward().bind(this)}
            visualizeBreakpointBackward={globalBreakpointProcessor.eventHandlers.visualizeBackward().bind(this)}
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
