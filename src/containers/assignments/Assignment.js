import React, { Component } from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';
import { If } from 'react-extras';
import JavaEditor from 'components/JavaEditor/JavaEditor';
import clone from 'clone';
import api from 'api';
import ui from 'utils/ui';
import storage from 'utils/storage';
import strings from 'utils/strings';

export default class Assignment extends Component {

  state = {
    assignment: null,
    contents: null,
    user: storage.get('user_data'),
    ui: clone(ui.state)
  }

  initializers = {
    getData: () => {
      ui.obj.loader.show(this);

      api.assignments.get(this.props.match.params.id)
        .then(res => {
          ui.obj.loader.hide(this);
          this.setState({
            assignment: res.data.assignment,
            contents: res.data.contents
          });
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
        });
    }
  }

  eventHandlers = {
    saveAssignment: () => {
      const { user, assignment } = this.state;

      const data = {
        extra: assignment.type === 'impl_general'
          ? this.refs.editor.getFiles()
          : null // TODO: add other types
      };

      ui.obj.loader.show(this);

      api.assignments.update(this.props.match.params.id, { assignment: data })
        .then(res => {
          ui.obj.loader.hide(this);
          ui.obj.message.showInfo(this, 'The assignment has been updated');
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
        });
    },

    submitAssignment: () => {
      ui.obj.loader.show(this);

      api.assignments.submit(this.props.match.params.id)
        .then(res => {
          ui.obj.loader.hide(this);
          ui.obj.message.showInfo(this, 'The assignment has been submitted');
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
        });
    },

    viewSubmissions: () => {
      this.props.history.push(`/dashboard/assignments/${this.props.match.params.id}/submissions`);
    },

    back: () => {
      this.props.history.push('/dashboard/assignments');
    }
  }

  renderers = {
    content: () => {
      let content = null;
      let { assignment } = this.state;

      if (assignment === null) {
        return null;
      }

      switch (assignment.type) {
        case 'impl_general':
          content = this.renderers.implGeneralContent()
          break;
      }

      return (
        <div>
          <p>
            {assignment.description} | {assignment.due_date}
          </p>

          {content}
        </div>
      );
    },

    implGeneralContent: () => {
      const initialContent = this.state.user.teacher
        ? strings.javaEditorInitialContent
        : null
      ;

      return (
        <JavaEditor
          ref='editor'
          files={this.state.contents}
          initialContent={initialContent} />
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

        <Button animated primary floated='right' onClick={this.eventHandlers.saveAssignment}>
          <Button.Content visible>Save</Button.Content>
          <Button.Content hidden>
            <Icon name='upload' />
          </Button.Content>
        </Button>

        <If condition={this.state.user.teacher === 1}>
          <Button basic color='blue' floated='right' onClick={this.eventHandlers.viewSubmissions}>
            View submissions
          </Button>
        </If>

        <If condition={this.state.user.teacher === 0}>
          <Button basic color='blue' floated='right' onClick={this.eventHandlers.submitAssignment}>
            Submit
          </Button>
        </If>

        <br style={{ clear: 'both' }}/>
      </div>
    )
  }

  componentWillMount() {
    this.initializers.getData();
  }

  render() {
    const { assignment } = this.state;

    return (
      <div className='dashboard-card'>
        {ui.obj.loader.render(this)}

        <div className='dashboard-card-header'>
          <Header
              as='h1'
              className='light-heading'>

              {assignment === null ? 'Assignment' : `Assignment: ${assignment.title}`}
            </Header>
        </div>

        <div className='dashboard-card-content'>
          {ui.obj.message.render(this)}

          {this.renderers.content()}
        </div>

        <div className='dashboard-card-footer'>
          {this.renderers.footer()}
        </div>
      </div>
    );
  }

}
