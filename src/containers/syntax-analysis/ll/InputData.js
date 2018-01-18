import React, { Component } from 'react';
import { Button, Header, Menu, Grid, Icon } from 'semantic-ui-react';
import 'jsoneditor/dist/jsoneditor.min.css';
import JSONEditor from 'jsoneditor';
import automata from 'utils/automata';

export default class InputData extends Component {

  state = {
    input: {
      inputMethod: 'default',
      content: '',
      jsonEditor: null
    }
  }

  eventHandlers = {
    handleInputMethodClick: event => {
      let input = this.state.input;

      input.inputMethod = event.target.getAttribute('method');

      this.setState({ input });
    },

    handleNextClick: () => {
      const data = this.state.input.inputMethod === 'default'
                  ? this.getInputData()
                  : this.state.input.jsonEditor.get();

      this.props.windowChangeHandler('viz', data);
    },
  }

  getInputData = () => {
    return null;
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
                Input data for the LL parser
              </Header>
              <p>
                In this section you're going to use a non-deterministic LL parser
                where you will input each step to take.
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
          <p>sdasjdjasjdjksadjkjkas</p>
        </div>

        <div className='dashboard-card-footer'>
          <Button.Group>
            <Button positive={this.state.input.inputMethod === 'default'} method='default' onClick={this.eventHandlers.handleInputMethodClick}>Default</Button>
            <Button.Or />
            <Button positive={this.state.input.inputMethod === 'json'} method='json' onClick={this.eventHandlers.handleInputMethodClick}>JSON</Button>
          </Button.Group>

          <Button animated primary floated='right' onClick={this.eventHandlers.handleNextClick}>
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
