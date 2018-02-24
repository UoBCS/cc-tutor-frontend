import React, { Component } from 'react';
import { Card, Grid, Header, Button, List, Icon, Input } from 'semantic-ui-react';
import { For, If } from 'react-extras';
import auth from 'utils/auth';
import ui from 'utils/ui';
import api from 'api';
import clone from 'clone';

export default class Profile extends Component {

  state = {
    user: null,
    users: [],
    emailFields: [''],
    ui: clone(ui.state)
  }

  componentWillMount() {
    ui.obj.loader.show(this);
    this.initializers.getData(
      this.initializers.getUsersData
    );
  }

  initializers = {
    getData: cb => {
      auth.getUserData()
        .then(res => {
          this.setState({
            user: res.data
          }, cb);
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showError('An error has occurred when retrieving user data.');
        });
    },

    getUsersData: () => {
      const isTeacher = this.state.user.teacher;
      const namespace = isTeacher ? 'teacher' : 'student';
      const method = isTeacher ? 'getStudents' : 'getTeachers';

      api[namespace][method]()
        .then(res => {
          ui.obj.loader.hide(this);

          this.setState({ users: res.data });
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showError(`An error has occurred when retrieving ${isTeacher ? 'students' : 'teachers'}.`);
        });
    }
  }

  eventHandlers = {
    addEmailField: () => {
      this.setState({
        emailFields: this.state.emailFields.concat([''])
      });
    },

    removeEmailField: index => () => {
      this.setState({
        emailFields: this.state.emailFields.filter((_, idx) => index !== idx)
      });
    },

    changeEmailField: index => event => {
      this.setState({
        emailFields: this.state.emailFields.map((s, _idx) => {
          if (_idx !== index) {
            return s;
          }

          return event.target.value;
        })
      });
    },

    sendInvitationEmail: () => {
      api.teacher.sendClassInvitationEmail(this.state.emailFields)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  renderers = {
    userContent: user => {
      if (user === null) {
        return null;
      }

      const isTeacher = user.teacher === 1;

      return (
        <div>
          <List>
            <List.Item content={user.email} />

            <If condition={isTeacher}>
              <List.Item>
                Class invitation token: {user.class_invitation_token}
              </List.Item>

              <For of={this.state.emailFields} render={(email, index) => (
                <Input
                  key={index}
                  value={email}
                  style={{ margin: '5px 10px 5px 0px' }}
                  placeholder='Email...'
                  onChange={this.eventHandlers.changeEmailField(index)}
                  action={<Button icon='close' />} />
              )}/>

              <Button basic onClick={this.eventHandlers.addEmailField}>
                Add
              </Button>

              <Button
                primary
                icon='send'
                labelPosition='right'
                content='Send'
                onClick={this.eventHandlers.sendInvitationEmail} />
            </If>
          </List>

          <Header as='h3'>{isTeacher ? 'Students' : 'Teachers'}</Header>

          <Card.Group>
            <For of={this.state.users} render={(user, index) => (
              <Card key={index}>
                <Card.Content>
                  <Card.Header>{user.name}</Card.Header>
                  <Card.Meta>{user.teacher ? 'Teacher' : 'Student'}</Card.Meta>
                  <Card.Description>Email: {user.email}</Card.Description>
                </Card.Content>
              </Card>
            )}/>
          </Card.Group>
        </div>
      );
    }
  }

  render() {
    const { user } = this.state;

    return (
      <div className='dashboard-card'>
        {ui.obj.loader.render(this)}

        <div className='dashboard-card-header'>
          <Header
            as='h1'
            className='light-heading'>
            {user === null ? null : `${user.name} - ${user.teacher ? 'Teacher' : 'Student'}`}
          </Header>
        </div>

        <div className='dashboard-card-content'>
          {ui.obj.message.render(this)}

          {this.renderers.userContent(user)}
        </div>
      </div>
    );
  }

}
