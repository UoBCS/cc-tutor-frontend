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

    const label = breakpoint.index < 0 ? null : breakpoint.data[breakpoint.index].label;

    const data = breakpoint.index < 0 ? null : breakpoint.data[breakpoint.index].data;

    const cekMachineStep = breakpoint.index < 0 ? null :
      <CekMachineStep
        label={label}
        data={data} />

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
          <Grid divided>
            <Grid.Column width={8}>
              <Input
                className='CekMachine_lambda_input'
                name='lambda'
                size='large'
                placeholder='Enter lambda...'
                value={this.state.input.lambda}
                onChange={this.eventHandlers.inputChangeHandler}
                action={<Button onClick={this.eventHandlers.submitLambdaHandler}>Submit</Button>} />
            </Grid.Column>

            <Grid.Column width={8} className='CekMachine_instructions'>
              <pre className={label === 'VARIABLE' ? 'CekMachine_highlight' : null}>〈 x | E | K 〉⟼ 〈 lookup x in E | E | K 〉</pre>
              <pre className={label === 'APPLICATION' ? 'CekMachine_highlight' : null}>〈 M<sub>1</sub> M<sub>2</sub> | E | K 〉⟼ 〈 M<sub>1</sub> | E | (◯ M<sub>2</sub> E) , K 〉</pre>
              <pre className={label === 'FUNCTION' ? 'CekMachine_highlight' : null}>〈 λx.M | E | K 〉⟼ 〈 clos(λx.M, E) | E | K 〉</pre>
              <pre className={label === 'VALUE_1' ? 'CekMachine_highlight' : null}>〈 W | E<sub>1</sub> | (◯ M E<sub>2</sub>) , K 〉⟼ 〈 M | E<sub>2</sub> | (W ◯) , K 〉</pre>
              <pre className={label === 'VALUE_2' ? 'CekMachine_highlight' : null}>〈 W | E<sub>1</sub> | (clos(λx.M, E<sub>2</sub>) ◯) , K 〉⟼ 〈 M | E<sub>2</sub>[x ⟼ W] | K 〉</pre>
            </Grid.Column>
          </Grid>

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
