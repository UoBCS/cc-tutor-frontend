import React, { Component } from 'react';
import { Button, Container, Dropdown, Form, TextArea, Icon, Input, Segment, Header, Menu, Grid, Step } from 'semantic-ui-react';
import FiniteAutomatonCreator from 'components/FiniteAutomatonCreator';
import 'jsoneditor/dist/jsoneditor.min.css';
import JSONEditor from 'jsoneditor';
import automata from '../../utils/automata';

class InputNfa extends Component {

  state = {
    inputMethod: 'manual',
    jsonEditor: null,
    finishedManualInput: false,
    nfaData: null
  }

  componentDidMount() {
    this.createJsonEditor();
  }

  handleInputMethodClick = event => {
    this.setState({
      inputMethod: event.target.getAttribute('method')
    });
  }

  handleContinueClick = () => {
    if (this.state.inputMethod === 'manual') {
      this.setState({ finishedManualInput: true });
    } else if (this.state.inputMethod === 'json') {
      this.props.windowChangeHandler('viz', { nfa: this.state.jsonEditor.get() });
    }
  }

  handleManualEditingFinish = edges => {
    this.props.windowChangeHandler('viz', { nfa: automata.fromVis(edges) });
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

  createNfaData = () => {
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
      <div>
        <Container className='dashboard-content'>
          <Grid>
            <Grid.Column floated='left' width={9}>
              <Header
                as='h1'
                className='light-heading'>
                Create the non-deterministic finite automaton
              </Header>
              <p>
                Input the NFA either using the manual tingy or json
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

          <FiniteAutomatonCreator
            hidden={this.state.inputMethod !== 'manual'}
            containerElement='manualInput'
            finished={this.state.finishedManualInput}
            onFinishEditing={this.handleManualEditingFinish}/>

          <div hidden={this.state.inputMethod !== 'json'} style={{ marginTop: 20 }}>
            <div id='jsonEditor' style={{ height: 600, margin: '10px auto' }}></div>
          </div>
        </Container>

        <Segment inverted style={{ position: 'fixed', right: 0, left: 250, bottom: 0, borderRadius: 0 }}>
          <Menu inverted secondary size='massive'>
            <Menu.Menu style={{ margin: '0 auto' }}>
              <Menu.Item>
                <Button disabled labelPosition='left' icon='left chevron' content='Go back'/>
              </Menu.Item>
              <Menu.Item>
                <Button.Group>
                  <Button positive={this.state.inputMethod === 'manual'} method='manual' onClick={this.handleInputMethodClick}>Manual input</Button>
                  <Button.Or />
                  <Button positive={this.state.inputMethod === 'json'} method='json' onClick={this.handleInputMethodClick}>JSON input</Button>
                </Button.Group>
              </Menu.Item>
              <Menu.Item>
                <Button primary labelPosition='right' icon='right chevron' content='Continue' onClick={this.handleContinueClick} />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Segment>
      </div>
    );
  }

}

export default InputNfa;
