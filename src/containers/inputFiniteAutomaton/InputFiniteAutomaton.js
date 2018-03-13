import React, { Component } from 'react';
import { Button, Header, Icon, Menu, Grid } from 'semantic-ui-react';
import FiniteAutomatonCreator from 'components/FiniteAutomatonCreator';
import 'jsoneditor/dist/jsoneditor.min.css';
import JSONEditor from 'jsoneditor';
import automata from 'utils/automata';

export default class InputFiniteAutomaton extends Component {

  state = {
    inputMethod: 'manual',
    jsonEditor: null
  }

  componentDidMount() {
    this.createJsonEditor();
  }

  eventHandlers = {
    inputMethodClick: event => {
      this.setState({
        inputMethod: event.target.getAttribute('method')
      });
    },

    nextClick: () => {
      const fa = this.state.inputMethod === 'manual'
        ? this.refs.finiteAutomatonCreator.getFiniteAutomaton()
        : this.state.jsonEditor.get();

      this.props.windowChangeHandler('viz', { fa });
    }
  }

  createJsonEditor = () => {
    const jsonEditor = new JSONEditor(document.getElementById('jsonEditor'), {
      mode: 'code',
      modes: ['code', 'tree'],
      search: true
    });

    jsonEditor.set([
      {
        "src": { "id": 0, "final": false },
        "char": "ε",
        "dest": { "id": 1, "final": true }
      },
      {
        "src": { "id": 1, "final": true },
        "char": "a",
        "dest": { "id": 2, "final": true }
      }
    ]);

    this.setState({ jsonEditor });
  }

  createFiniteAutomatonData = () => {
    let nfa;

    if (this.state.inputMethod === 'json') {
      nfa = this.state.jsonEditor.get();
    }

    if (this.state.inputMethod === 'manual') {
      this.setState({ finishedManualInput: true });
      nfa = [];
    }

    return { nfa };
  }

  render() {
    return (
      <div className='dashboard-card'>
        <div className='dashboard-card-header'>
          <Grid className='viz-heading'>
            <Grid.Column floated='left' width={9} className='viz-heading-left '>
              <Header
                as='h1'
                className='light-heading'>
                Create the finite automaton
              </Header>
              <p>
                Input the finite automaton either using the manual input or JSON
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
          <FiniteAutomatonCreator
            ref='finiteAutomatonCreator'
            hidden={this.state.inputMethod !== 'manual'}
            containerElement='manualInput'/>

          <div hidden={this.state.inputMethod !== 'json'} style={{ marginTop: 20 }}>
            <div id='jsonEditor' style={{ height: 600, margin: '10px auto' }}></div>
          </div>
        </div>

        <div className='dashboard-card-footer'>
          <Button.Group>
            <Button positive={this.state.inputMethod === 'manual'} method='manual' onClick={this.eventHandlers.inputMethodClick}>Manual input</Button>
            <Button.Or />
            <Button positive={this.state.inputMethod === 'json'} method='json' onClick={this.eventHandlers.inputMethodClick}>JSON input</Button>
          </Button.Group>

          <Button animated primary floated='right' onClick={this.eventHandlers.nextClick}>
            <Button.Content visible>Next</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>
          <br style={{ clear: 'both' }}/>
        </div>
      </div>
    );
  }

}
