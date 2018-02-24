import React, { Component } from 'react';
import { Card, Grid, Header, Button, List, Icon, Input } from 'semantic-ui-react';
import { Choose, For } from 'react-extras';
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
          ui.obj.message.showError(
            this,
            ui.renderErrors(err, 'An error has occurred while retrieving assignments.')
          );
        });
    }
  }

  eventHandlers = {
    createAssignment: () => {
      this.props.history.push('/dashboard/assignments/create');
    },

    viewAssignment: id => () => {
      this.props.history.push(`/dashboard/assignments/${id}`);
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
                    <div className='ui'>
                      <Button basic color='blue' onClick={this.eventHandlers.viewAssignment(assignment.id)}>View</Button>
                    </div>
                  </Card.Content>
                </Card>
              )}/>
            </Card.Group>
          </Choose.Otherwise>
        </Choose>
      );
    }
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
      </div>
    );
  }

}
