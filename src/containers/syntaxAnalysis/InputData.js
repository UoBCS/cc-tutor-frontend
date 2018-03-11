import React, { Component } from 'react';
import { Button, Header, Menu, Grid, Icon, Form } from 'semantic-ui-react';
import TokenInput from 'components/TokenInput';
import GrammarInput from 'components/GrammarInput/GrammarInput';
import 'jsoneditor/dist/jsoneditor.min.css';
import JSONEditor from 'jsoneditor';
import automata from 'utils/automata';

export default class InputData extends Component {

  state = {
    input: {
      inputMethod: 'default',
      content: '',
      jsonEditor: null,
      tokens: {
        components: [{ key: 0, ref: '0' }],
        refIndex: 1
      }
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
        "content": "aab",
        "token_types": [
          {
            "name": "A",
            "regex": "a",
            "skippable": false,
            "priority": 1
          },
          {
            "name": "B",
            "regex": "b",
            "skippable": false,
            "priority": 0
          }
        ],
        "grammar": {
          "productions": {
            "s": [["l", "B"]],
            "l": [["A", "l"], null]
          },

          "start_symbol": "s"
        }
      });

      this.setState({ input });
    }
  }

  eventHandlers = {
    inputMethodClick: event => {
      let input = this.state.input;

      input.inputMethod = event.target.getAttribute('method');

      this.setState({ input });
    },

    addTokenCLick: () => {
      const input = this.state.input;

      input.tokens.components.push({
        key: input.tokens.refIndex,
        ref: input.tokens.refIndex + ''
      });
      input.tokens.refIndex++

      this.setState({ input });
    },

    inputChange: event => {
      const target = event.target;
      let input = this.state.input;
      input[target.name] = target.value;
      this.setState({ input });
    },

    nextClick: () => {
      const data = this.state.input.inputMethod === 'default'
                  ? this.getInputData()
                  : this.state.input.jsonEditor.get();

      this.props.windowChangeHandler(this.props.data.nextWindow, data);
    }
  }

  getInputData = () => this.refs.grammar;

  render() {
    return (
      <div className='dashboard-card'>
        <div className='dashboard-card-header'>
          <Grid className='viz-heading'>
            <Grid.Column floated='left' width={9} className='viz-heading-left '>
              <Header
                as='h1'
                className='light-heading'>
                Input data for the parser
              </Header>
              <p>
                Use the default interface or JSON input.
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
          <Form hidden={this.state.input.inputMethod !== 'default'}>
            <div>
              <Header as='h3'>Tokens</Header>
              {this.state.input.tokens.components.map(c =>
                <TokenInput id={c.key} key={c.key} ref={c.ref} />
              )}

              <Button animated='vertical' onClick={this.eventHandlers.addTokenCLick}>
                <Button.Content hidden>Token</Button.Content>
                <Button.Content visible>
                  <Icon name='plus' />
                </Button.Content>
              </Button>
            </div>

            <div style={{ marginTop: 30, paddingTop: 30, borderTop: '1px solid #dcdcdc' }}>
              <Header as='h3'>Grammar</Header>
              <GrammarInput ref='grammar' />
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
          <Button.Group>
            <Button positive={this.state.input.inputMethod === 'default'} method='default' onClick={this.eventHandlers.inputMethodClick}>Default</Button>
            <Button.Or />
            <Button positive={this.state.input.inputMethod === 'json'} method='json' onClick={this.eventHandlers.inputMethodClick}>JSON</Button>
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
