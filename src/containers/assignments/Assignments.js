import React, { Component } from 'react';
import { Card, Grid, Header, Button, List, Icon, Input } from 'semantic-ui-react';
import { Choose, For, If } from 'react-extras';
import DataPlaceholder from 'components/DataPlaceholder/DataPlaceholder';
import clone from 'clone';
import api from 'api';
import ui from 'utils/ui';
import storage from 'utils/storage';

export default class Assignments extends Component {

  state = {
    assignments: [],
    user: storage.get('user_data'),
    ui: clone(ui.state)
  }

  initializers = {
    getAssignments: () => {
      ui.obj.loader.show(this);

      api.assignments.getAll()
        .then(res => {
          ui.obj.loader.hide(this);
          this.setState({ assignments: res.data });
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
        });
    }
  }

  eventHandlers = {
    createAssignment: () => {
      this.props.history.push('/dashboard/assignments/create');
    },

    viewAssignment: id => () => {
      this.props.history.push(`/dashboard/assignments/${id}`);
    },

    deleteAssignment: (id, index) => () => {
      ui.obj.loader.show(this);

      api.assignments.delete(id)
        .then(res => {
          ui.obj.loader.hide(this);
          ui.obj.message.showInfo(this, 'Assignment deleted successfully');
          this.setState({ assignments: this.state.assignments.filter((_, i) => i !== index) });
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
        })
    }
  }

  renderers = {
    content: () => {
      const { user } = this.state;

      return (
        <Choose>
          <Choose.When condition={this.state.assignments.length === 0}>
            <DataPlaceholder
              title='No assignments'
              subtitle={user.teacher ? 'Create any type of assignment.' : 'Upcoming assignments will be displayed here.'}
              icon='book'
              action={user.teacher ? <Button positive size='large' fluid onClick={this.eventHandlers.createAssignment}>Create</Button> : null}
            />
          </Choose.When>
          <Choose.Otherwise>
            <Card.Group>
              <For of={this.state.assignments} render={(assignment, index) => (
                <Card key={index}>
                  <Card.Content>
                    <Card.Header content={assignment.title} />
                    <Card.Meta content={`issued by ${assignment.teacher.name}`} />
                    <Card.Description content={assignment.description} />
                  </Card.Content>
                  <Card.Content extra>
                    <div className='ui two buttons'>
                      <Button
                        basic
                        color='blue'
                        onClick={this.eventHandlers.viewAssignment(user.teacher ? assignment.id : assignment.assignment_id)}>
                        View
                      </Button>

                      <If condition={user.teacher === 1}>
                        <Button
                          basic
                          color='red'
                          onClick={this.eventHandlers.deleteAssignment(user.teacher ? assignment.id : assignment.assignment_id, index)}>
                          Delete
                        </Button>
                      </If>
                    </div>
                  </Card.Content>
                </Card>
              )}/>
            </Card.Group>
          </Choose.Otherwise>
        </Choose>
      );
    },

    footer: () => (
      <div>
        <Button animated primary floated='right' onClick={this.eventHandlers.createAssignment}>
          <Button.Content visible>New</Button.Content>
          <Button.Content hidden>
            <Icon name='add' />
          </Button.Content>
        </Button>
        <br style={{ clear: 'both' }}/>
      </div>
    )
  }

  componentWillMount() {
    this.initializers.getAssignments();
  }

  render() {
    return (
      <div className='dashboard-card'>
        {ui.obj.loader.render(this)}

        <div className='dashboard-card-header'>
          <Header
            as='h1'
            className='light-heading'>
            Assignments
          </Header>
        </div>

        <div className='dashboard-card-content'>
          {ui.obj.message.render(this)}

          {this.renderers.content()}
        </div>

        <If condition={this.state.user.teacher === 1}>
          <div className='dashboard-card-footer'>
            {this.renderers.footer()}
          </div>
        </If>
      </div>
    );
  }

}
