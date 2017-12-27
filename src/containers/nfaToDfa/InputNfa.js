import React, { Component } from 'react';
import { Button, Container, Dropdown, Form, TextArea, Icon, Input, Segment, Header, Menu, Grid, Step } from 'semantic-ui-react';
import FiniteAutomatonCreator from 'components/FiniteAutomatonCreator';
//import misc from 'utils/misc';

const jsnx = window.jsnx;

class InputNfa extends Component {

  manual = {
    nfa: new jsnx.DiGraph(),
    currentNodeIndex: 0
  }

  state = {
    inputMethod: 'manual',
    jsonInput: ''
  }

  handleInputMethodClick = event => {
    this.setState({
      inputMethod: event.target.getAttribute('method')
    });
  }

  handleTextAreaChange = event => {
    const target = event.target;

    this.setState({
      [target.id]: target.value
    });
  }

  handleTextAreaKeyDown = event => {
    if (event.keyCode === 9) { // tab was pressed
      let target = event.target;

      // get caret position/selection
      let val = target.value;
      let start = target.selectionStart;
      let end = target.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      target.value = val.substring(0, start) + '\t' + val.substring(end);

      // put caret at right position again
      target.selectionStart = target.selectionEnd = start + 1;

      // prevent the focus lose
      event.preventDefault();
    }
  }

  handleContinueClick = () => {
    this.props.windowChangeHandler('viz', this.createNfaData());
  }

  createNfaData = () => {
    let nfa;

    if (this.state.inputMethod === 'json') {
      nfa = JSON.parse(this.state.jsonInput);
    }

    if (this.state.inputMethod === 'manual') {
      nfa = [];
    }

    return { nfa };
  }

  render() {
    /*
    <Header
                as='h1'
                className='light-heading'>
                STEP 1: CREATE THE NFA
              </Header>
    */

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

          <Segment hidden={this.state.inputMethod !== 'manual'}>
            <FiniteAutomatonCreator containerElement='manualInput' />
          </Segment>

          <div hidden={this.state.inputMethod !== 'json'} style={{ marginTop: 20 }}>
            <Form>
              <TextArea
                id='jsonInput'
                placeholder='Input your JSON'
                value={this.state.json}
                style={{ minHeight: 700, fontFamily: 'monospace' }}
                onChange={this.handleTextAreaChange}
                onKeyDown={this.handleTextAreaKeyDown}/>
            </Form>
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
