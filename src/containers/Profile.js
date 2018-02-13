import React, { Component } from 'react';
import { Grid, Header, Button, List, Icon } from 'semantic-ui-react';
import auth from 'utils/auth';
import ui from 'utils/ui';
import clone from 'clone';

export default class Profile extends Component {

  state = {
    user: null,
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

          console.log(res.data);
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          console.log(err);
        });
    }
  }

  eventHandlers = {
    refreshClassInvitationTokenHandler: () => {

    }
  }

  render() {
    const { user } = this.state;
    const userContent = user === null ? null :
     (
      <List>
        <List.Item content={user.email} />
        <List.Item>
          Class invitation token: {user.class_invitation_token}
          <Icon
            name='refresh'
            style={{ marginLeft: 7 }}
            link
            onClick={this.eventHandlers.refreshClassInvitationTokenHandler}></Icon>
        </List.Item>
      </List>
     )

    return (
      <div>
      {ui.obj.loader.render(this)}
      <div className='dashboard-card'>
        <div className='dashboard-card-header'>
          <Header
            as='h1'
            className='light-heading'>
            {user === null ? null : `${user.name} - ${user.teacher ? 'Teacher' : 'Student'}`}
          </Header>
        </div>

        <div className='dashboard-card-content'>
          {userContent}
        </div>
      </div>
      </div>
    );
  }

}
