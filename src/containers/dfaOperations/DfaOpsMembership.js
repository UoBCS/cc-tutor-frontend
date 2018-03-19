import React, { Component } from 'react';
import { Button, Icon, Input, Card, Grid, Header } from 'semantic-ui-react';
import { Choose } from 'react-extras';
import Window from 'components/Window/Window';
import VisualizationControl from 'components/VisualizationControl/VisualizationControl';
import VisualizationElement from 'components/VisualizationElement/VisualizationElement';
import FiniteAutomatonEditor from 'components/FiniteAutomatonEditor/FiniteAutomatonEditor';
import ConsumableInput from 'components/ConsumableInput/ConsumableInput';
import { breakpoint } from './membershipBreakpoint';
import globalBreakpointProcessor from 'utils/globalBreakpointProcessor';
import api from 'api';
import automata from 'utils/automata';
import misc from 'utils/misc';
import ui from 'utils/ui';
import clone from 'clone';

export default class DfaOpsMembership extends Component {

  state = {
    view: 'input',

    word: {
      data: '',
      index: -1
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

  eventHandlers = {
    wordChange: (_, input) => {
      this.setState({
        word: {
          data: input.value,
          index: -1
        }
      });
    },

    runTestClick: () => {
      ui.obj.loader.show(this);

      const dfaData = this.refs.dfaEditor.getData();

      api.dfaOps.membership({ dfa: dfaData, word: this.state.word.data })
        .then(res => {
          ui.obj.loader.hide(this);

          this.setState({
            view: 'visualization'
          }, () => {
            this.setState({
              dfa: automata.visDataFormat('dfa-viz', dfaData),
              breakpoint: {
                data: res.data.breakpoints,
                index: -1
              }
            });
          });
        })
        .catch(err => {
          console.log(err);
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
        });
    },

    backClick: () => {
      this.setState({ view: 'input' });
    }
  }

  componentWillMount() {
    globalBreakpointProcessor.initialize(breakpoint);
  }

  render() {
    return (
      <div className='dashboard-card'>
        {ui.obj.loader.render(this)}

        {ui.obj.toast.render(this)}

        <div className='dashboard-card-header'>
          <Grid className='viz-heading'>
            <Grid.Column floated='left' width={9} className='viz-heading-left '>
              <Header
                as='h1'
                className='light-heading'>
                Deterministic Finite Automaton Membership Testing
              </Header>
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

          <Choose>
            <Choose.When condition={this.state.view === 'input'}>
              <Header as='h3'>Input word</Header>
              <Input value={this.state.word.data} onChange={this.eventHandlers.wordChange} placeholder='Word to test...' />

              <Header as='h3'>Deterministic Finite Automaton</Header>
              <FiniteAutomatonEditor ref='dfaEditor' />
            </Choose.When>
            <Choose.Otherwise>
              <VisualizationElement.ActionsHistory ref='actionsHistory'/>

              <Window title='Input'>
                <ConsumableInput content={this.state.word}/>
              </Window>

              <Window title='Deterministic Finite Automaton'>
                <div id='dfa-viz' style={{ height: 500 }}></div>
              </Window>

              <VisualizationControl
                active
                breakpoint={this.state.breakpoint}
                visualizeBreakpointForward={globalBreakpointProcessor.eventHandlers.visualizeForward().bind(this)}
                visualizeBreakpointBackward={globalBreakpointProcessor.eventHandlers.visualizeBackward().bind(this)}
                updateState={misc.updateState.bind(this)}/>
            </Choose.Otherwise>
          </Choose>
        </div>

        <div className='dashboard-card-footer'>
          <Choose>
            <Choose.When condition={this.state.view === 'input'}>
              <Button animated primary floated='right' onClick={this.eventHandlers.runTestClick}>
                <Button.Content visible>Run test</Button.Content>
                <Button.Content hidden>
                  <Icon name='right arrow' />
                </Button.Content>
              </Button>
              <br style={{ clear: 'both' }}/>
            </Choose.When>

            <Choose.Otherwise>
              <Button animated onClick={this.eventHandlers.backClick}>
                <Button.Content visible>Back</Button.Content>
                <Button.Content hidden>
                  <Icon name='left arrow' />
                </Button.Content>
              </Button>
            </Choose.Otherwise>
          </Choose>
        </div>
      </div>
    );
  }

}
