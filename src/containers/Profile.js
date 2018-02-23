import React, { Component } from 'react';
import { Grid, Header, Button, List, Icon, Input } from 'semantic-ui-react';
import { For, If } from 'react-extras';
import auth from 'utils/auth';
import ui from 'utils/ui';
import api from 'api';
import clone from 'clone';

export default class Profile extends Component {

  state = {
    user: null,
    emailFields: [''],
    ui: clone(ui.state)
  }

  componentWillMount() {
    ui.obj.loader.show(this);
    this.initializers.getData();
  }

  initializers = {
    getData: () => {
      auth.getUserData()
        .then(res => {
          ui.obj.loader.hide(this);

          this.setState({
            user: res.data
          }, () => {
            ui.obj.loader.hide(this);
          });
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          console.log(err);
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

      return (
        <List>
          <List.Item content={user.email} />

          <If condition={user.teacher === 1}>
            <List.Item>
              Class invitation token:
              <Button onClick={this.eventHandlers.openSendEmailModal}>{user.class_invitation_token}</Button>
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
          {this.renderers.userContent(user)}
        </div>
      </div>
    );
  }

}
