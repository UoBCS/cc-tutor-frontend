import React, { Component } from 'react';
import { Button, Header, Icon, Grid, Segment, Label, Input } from 'semantic-ui-react';
import VisualizationControl from 'components/VisualizationControl/VisualizationControl';
import CekMachineStep from './CekMachineStep';
import api from 'api';
import clone from 'clone';
import _ from 'lodash';
import ui from 'utils/ui';
import automata from 'utils/automata';
import internal from './internal';

import './CekMachine.css';

export default class CekMachine extends Component {

  state = {
    input: {
      lambda: ''
    },

    breakpoint: {
      data: null,
      index: -1
    },

    ui: clone(ui.state)
  }

  breakpoint = {
    visualizeForward: breakpoint => {
      const data = breakpoint.data;
      const index = this.state.breakpoint.index;
      internal.forward[_.camelCase(breakpoint.label)].call(this, { data, index });
    },

    visualizeBackward: breakpoint => {
      const data = breakpoint.data;
      const index = this.state.breakpoint.index;
      internal.backward[_.camelCase(breakpoint.label)].call(this, { data, index });
    }
  }

  eventHandlers = {
    submitLambdaHandler: () => {
      api.cekMachineRun(this.state.input.lambda)
        .then(res => {
          this.setState({
            breakpoint: {
              data: res.data,
              index: 0
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    inputChangeHandler: event => {
      const target = event.target;
      let input = this.state.input;
      input[target.name] = target.value;
      this.setState({ input });
    }
  }

  helpers = {
    updateState: (obj, cb) => {
      this.setState(obj, cb);
    }
  }

  render() {
    const { breakpoint } = this.state;

    const cekMachineStep = breakpoint.index < 0 ? null :
      <CekMachineStep
        label={breakpoint.data[breakpoint.index].label}
        data={breakpoint.data[breakpoint.index].data} />

    return (
      <div className='CekMachine dashboard-card'>
        <div className='dashboard-card-header'>
          <Grid className='viz-heading'>
            <Grid.Column floated='left' width={9} className='viz-heading-left '>
              <Header
                as='h1'
                className='light-heading'>
                CEK Machine
              </Header>
              <p>
                In this section you're going to examine the CEK Machine.
                Click on the help button for more information.
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
          <Input
            name='lambda'
            size='large'
            placeholder='Enter lambda...'
            value={this.state.input.lambda}
            onChange={this.eventHandlers.inputChangeHandler}
            action={<Button onClick={this.eventHandlers.submitLambdaHandler}>Submit</Button>} />

          {cekMachineStep}

          <VisualizationControl
            active
            breakpoint={this.state.breakpoint}
            visualizeBreakpointForward={this.breakpoint.visualizeForward}
            visualizeBreakpointBackward={this.breakpoint.visualizeBackward}
            updateState={this.helpers.updateState}/>
        </div>
      </div>
    );
  }

}
