import React, { Component } from 'react';
import { Button, Form, Header, Icon, Tab, Grid } from 'semantic-ui-react';
import { If } from 'react-extras';
import DateTime from 'react-datetime';
import JavaEditor from 'components/JavaEditor/JavaEditor';
import clone from 'clone';
import api from 'api';
import ui from 'utils/ui';
import strings from 'utils/strings';

import 'components/ReactDateTime/react-datetime.css';

export default class CreateAssignment extends Component {

  state = {
    input: {
      title: '',
      description: '',
      type: 'impl_general', // 'impl_general', 'regex_to_nfa', 'nfa_to_dfa', 'll', 'lr', 'll1', 'lr0', 'cek_machine'
      due_date: new Date()
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

    dateInputChange: momentObj => {
      const { input } = this.state;

      input.due_date = momentObj.toDate();

      this.setState({ input });
    },

    createAssignment: () => {
      const { input } = this.state;
      let assignment = clone(input);
      assignment.due_date = assignment.due_date.toISOString().slice(0, 19).replace('T', ' ');

      ui.obj.loader.show(this);

      if (input.type === 'impl_general') {
        assignment.extra = {};
        assignment.extra.files = this.refs.editor.getFiles();
      }

      api.assignments.create({ assignment })
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
    header: () => (
      <Grid className='viz-heading'>
        <Grid.Column floated='left' width={9} className='viz-heading-left '>
          <Header
            as='h1'
            className='light-heading'>
            Create assignment
          </Header>
          <p>
            Create the AST classes/types for the parse tree.
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
    ),

    mainContent: () => {
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
            <div className='field'>
              <label>Due date</label>
              <DateTime
                name='due_date'
                value={input.due_date}
                onChange={this.eventHandlers.dateInputChange}
                className='ui fluid input'
                dateFormat='Y-MM-DD'
                timeFormat='HH:mm:ss' />
            </div>
          </Form.Group>
          <Form.TextArea name='description' value={input.description} onChange={this.eventHandlers.inputChange} label='Description' placeholder='Assignment instructions...' />
        </Form>
      );
    },

    secondaryContent: () => {
      let content = null;

      switch (this.state.input.type) {
        case 'impl_general':
          content = this.renderers.editor();
          break;
      }

      return <div style={{ marginTop: 30 }} >{content}</div>;
    },

    editor: () => {
      return (
        <div style={{ marginTop: 30 }}>
          <Header as='h4'>Test files</Header>
          <JavaEditor
            ref='editor'
            initialContent={strings.javaEditorInitialContent}/>
        </div>
      );
    },

    footer: () => (
      <div>
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
    )
  }

  render() {
    return (
      <div className='dashboard-card'>
        {ui.obj.loader.render(this)}

        <div className='dashboard-card-header'>
          {this.renderers.header()}
        </div>

        <div className='dashboard-card-content'>
          {ui.obj.message.render(this)}

          {this.renderers.mainContent()}

          {this.renderers.secondaryContent()}
        </div>

        <div className='dashboard-card-footer'>
          {this.renderers.footer()}
        </div>
      </div>
    );
  }

}
