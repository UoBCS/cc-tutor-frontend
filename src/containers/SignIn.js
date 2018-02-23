import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Header, Message, Segment } from 'semantic-ui-react';
import api from 'api';
import storage from 'utils/storage';
import ui from 'utils/ui';
import clone from 'clone';

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    ui: clone(ui.state)
  }

  getFormData = () => {
    let keys = ['email', 'password'];
    let obj = {};
    keys.forEach(k => obj[k] = this.state[k]);
    return obj;
  }

  handleInputChange = event => {
    const target = event.target;

    this.setState({
      [target.name]: target.value
    });
  }

  handleSignInClick = () => {
    ui.obj.loader.show(this);

    api.signIn(this.getFormData())
      .then(res => {
        ui.obj.loader.hide(this);
        storage.set('access_token', res.data.access_token);
        storage.set('user_data', res.data.user_data);
        this.props.history.push('/dashboard');
      })
      .catch(err => {
        ui.obj.loader.hide(this);
        ui.obj.message.show(this, 'negative', 'An error has occurred.', err.response.data.errors[0].detail);
      });
  }

  render() {
    return (
      <div>
        {ui.obj.message.render(this)}
        {ui.obj.loader.render(this)}

        <Header as='h2' color='teal' textAlign='center'>
          Log-in to your account
        </Header>
        <Form size='large'>
          <Segment stacked>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='E-mail address'
              name='email'
              value={this.state.email}
              onChange={this.handleInputChange}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              name='password'
              type='password'
              value={this.state.password}
              onChange={this.handleInputChange}
            />

            <Button color='teal' fluid size='large' onClick={this.handleSignInClick}>Login</Button>
          </Segment>
        </Form>
        <Message>
          New to CC Tutor? <Link to='/sign-up'>Sign Up</Link> | <Link to='/'>Home</Link>
        </Message>
      </div>
    );
  }
}

export default SignIn
