import React, { Component } from 'react';
import { Form, Button, Header, Icon, Tab } from 'semantic-ui-react';
import TokenInput from 'components/TokenInput';
import 'jsoneditor/dist/jsoneditor.min.css';
import JSONEditor from 'jsoneditor';

export default class InputData extends Component {

  state = {
    tokenInputs: {
      components: [{
        key: 0,
        ref: '0'
      }],
      refIndex: 1
    },

    input: {
      inputMethod: 'default',
      dfaMinimized: true,
      content: '',
      jsonEditor: null
    }
  }

  componentDidMount() {
    this.initializers.createJsonEditor();
  }

  initializers = {
    createJsonEditor: () => {
      const input = this.state.input;

      input.jsonEditor = new JSONEditor(document.getElementById('jsonEditor'), {
        mode: 'code',
        modes: ['code', 'tree'],
        search: true
      });

      input.jsonEditor.set({
        "content": "int a = 10;",
        "token_types": [
          {
            "name": "INT",
            "regex": "int",
            "skippable": false,
            "priority": 0
          },
          {
            "name": "IntegerLiteral",
            "regex": "(-|+)?[0-9]+",
            "skippable": false,
            "priority": 1
          },
          {
            "name": "SEMI",
            "regex": ";",
            "skippable": false,
            "priority": 2
          },
          {
            "name": "ASSIGN",
            "regex": "=",
            "skippable": false,
            "priority": 3
          },
          {
            "name": "Identifier",
            "regex": "[A-Za-z][A-Za-z0-9_]*",
            "skippable": false,
            "priority": 4
          },
          {
            "name": "WS",
            "regex": "[ \t\r\n\u000c]+",
            "skippable": false,
            "priority": 5
          }
        ]
      });

      this.setState({ input });
    }
  }

  eventHandlers = {
    nextClick: () => {
      const data = this.state.input.inputMethod === 'default'
                  ? this.getInputData()
                  : this.state.input.jsonEditor.get();

      const { dfaMinimized } = this.state.input;

      this.props.windowChangeHandler('viz', Object.assign({}, data, {dfa_minimized: dfaMinimized}));
    },

    addTokenClick: () => {
      let tokenInputs = this.state.tokenInputs;

      tokenInputs.components.push({
        key: tokenInputs.refIndex,
        ref: tokenInputs.refIndex + ''
      });
      tokenInputs.refIndex++

      this.setState({ tokenInputs });
    },

    inputChange: event => {
      const target = event.target;
      const { input } = this.state;
      input[target.name] = target.value;
      this.setState({ input });
    },

    inputMethodClick: event => {
      const { input } = this.state;

      input.inputMethod = event.target.getAttribute('method');

      this.setState({ input });
    },

    dfaMinimizedClick: event => {
      const { input } = this.state;

      input.dfaMinimized = event.target.getAttribute('value') === 'true';

      this.setState({ input });
    }
  }

  getInputData = () => {
    let data = {
      content: this.state.input.content,
      token_types: []
    };

    for (const comp of this.state.tokenInputs.components) {
      data.token_types.push(this.refs[comp.ref].getData());
    }

    return data;
  }

  render() {
    return (
      <div className='dashboard-card'>
        <div className='dashboard-card-header'>
          <Header as='h1'>Lexical analysis: input tokens and content</Header>
        </div>

        <div className='dashboard-card-content'>
          <Form hidden={this.state.input.inputMethod !== 'default'}>
            <div>
              <Header as='h3'>Tokens</Header>
              {this.state.tokenInputs.components.map(c =>
                <TokenInput id={c.key} key={c.key} ref={c.ref} />
              )}

              <Button animated='vertical' onClick={this.eventHandlers.addTokenClick}>
                <Button.Content hidden>Token</Button.Content>
                <Button.Content visible>
                  <Icon name='plus' />
                </Button.Content>
              </Button>
            </div>

            <div style={{ marginTop: 30, paddingTop: 30, borderTop: '1px solid #dcdcdc' }}>
              <Header as='h3'>Content</Header>
              <Form.TextArea
                name='content'
                placeholder='Insert content to split into tokens...'
                style={{ fontFamily: 'monospace' }}
                onChange={this.eventHandlers.inputChange}/>
            </div>
          </Form>

          <div
            id='jsonEditor'
            style={{ height: 600, margin: '10px auto' }}
            hidden={this.state.input.inputMethod !== 'json'}></div>
        </div>

        <div className='dashboard-card-footer'>
          <Button.Group style={{ marginRight: 20 }}>
            <Button positive={this.state.input.inputMethod === 'default'} method='default' onClick={this.eventHandlers.inputMethodClick}>Default</Button>
            <Button.Or />
            <Button positive={this.state.input.inputMethod === 'json'} method='json' onClick={this.eventHandlers.inputMethodClick}>JSON</Button>
          </Button.Group>

          <Button.Group>
            <Button positive={this.state.input.dfaMinimized} value={true} onClick={this.eventHandlers.dfaMinimizedClick}>Minimized DFA</Button>
            <Button.Or />
            <Button positive={!this.state.input.dfaMinimized} value={false} onClick={this.eventHandlers.dfaMinimizedClick}>Non-minimized DFA</Button>
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
