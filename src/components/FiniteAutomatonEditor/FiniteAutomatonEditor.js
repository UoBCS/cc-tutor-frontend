import React, { Component } from 'react';
import { Button, Header, Menu, Grid } from 'semantic-ui-react';
import FiniteAutomatonCreator from 'components/FiniteAutomatonCreator';
import 'jsoneditor/dist/jsoneditor.min.css';
import JSONEditor from 'jsoneditor';
import automata from 'utils/automata';

export default class FiniteAutomatonEditor extends Component {

  state = {
    inputMethod: 'manual',
    jsonEditor: null
  }

  initializers = {
    createJsonEditor: () => {
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
  }

  eventHandlers = {
    inputMethodClick: event => {
      this.setState({ inputMethod: event.target.getAttribute('method') });
    }
  }

  getData = () => this.state.inputMethod === 'manual'
      ? this.refs.finiteAutomatonCreator.getFiniteAutomaton()
      : this.state.jsonEditor.get();

  componentDidMount() {
    this.initializers.createJsonEditor();
  }

  renderers = {
    content: () => {
      return (
        <div>
          <FiniteAutomatonCreator
            ref='finiteAutomatonCreator'
            hidden={this.state.inputMethod !== 'manual'}
            containerElement='manualInput'/>

          <div hidden={this.state.inputMethod !== 'json'} style={{ marginTop: 20 }}>
            <div id='jsonEditor' style={{ height: 600, margin: '10px auto' }}></div>
          </div>

          <Button.Group>
            <Button positive={this.state.inputMethod === 'manual'} method='manual' onClick={this.eventHandlers.inputMethodClick}>Manual input</Button>
            <Button.Or />
            <Button positive={this.state.inputMethod === 'json'} method='json' onClick={this.eventHandlers.inputMethodClick}>JSON input</Button>
          </Button.Group>
        </div>
      );
    }
  }

  render() {
    return this.renderers.content();
  }

}
