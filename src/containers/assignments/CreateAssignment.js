import React, { Component } from 'react';
import { Button, Form, Header, Icon } from 'semantic-ui-react';
import clone from 'clone';
import api from 'api';
import ui from 'utils/ui';

export default class CreateAssignment extends Component {

  state = {
    input: {
      title: '',
      description: '',
      type: 'impl_general' // 'impl_general', 'regex_to_nfa', 'nfa_to_dfa', 'll', 'lr', 'll1', 'lr0', 'cek_machine'
    },
    ui: clone(ui.state)
  }

  eventHandlers = {
    inputChange: event => {
      const target = event.target;
      const { input } = this.state;

      input[target.name] = target.value;

      this.setState({ input });
    },

    createAssignment: () => {
      ui.obj.loader.show(this);

      api.assignments.create({ assignment: this.state.input })
        .then(res => {
          ui.obj.loader.hide(this);
          ui.obj.message.showInfo(this, 'The assignment has been created');
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showError(this, ui.renderErrors(err));
        });
    },

    back: () => {
      this.props.history.push('/dashboard/assignments');
    }
  }

  renderers = {
    content : () => {
      const options = [
        {key: 'impl_general', text: 'Implementation', value: 'impl_general'},
        {key: 'regex_to_nfa', text: 'Regular expression to NFA', value: 'regex_to_nfa'},
      ];

      const { input } = this.state;

      return (
        <Form>
          <Form.Group widths='equal'>
            <Form.Input name='title' value={input.title} onChange={this.eventHandlers.inputChange} fluid label='Title' placeholder='Title' />
            <Form.Select name='type' value={input.type} onChange={this.eventHandlers.inputChange} fluid label='Type' options={options} placeholder='Type' />
          </Form.Group>
          <Form.TextArea name='description' value={input.description} onChange={this.eventHandlers.inputChange} label='Description' placeholder='Assignment instructions...' />
        </Form>
      );
    }
  }

  render() {
    return (
      <div className='dashboard-card'>
        {ui.obj.loader.render(this)}

        <div className='dashboard-card-header'>
          <Header
            as='h1'
            className='light-heading'>
            Create assignment
          </Header>
        </div>

        <div className='dashboard-card-content'>
          {ui.obj.message.render(this)}

          {this.renderers.content()}
        </div>

        <div className='dashboard-card-footer'>
          <Button animated basic onClick={this.eventHandlers.back}>
            <Button.Content visible>Back</Button.Content>
            <Button.Content hidden>
              <Icon name='left arrow' />
            </Button.Content>
          </Button>

          <Button animated primary floated='right' onClick={this.eventHandlers.createAssignment}>
            <Button.Content visible>Create</Button.Content>
            <Button.Content hidden>
              <Icon name='add' />
            </Button.Content>
          </Button>
          <br style={{ clear: 'both' }}/>
        </div>
      </div>
    );
  }

}
