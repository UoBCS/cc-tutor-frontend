import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Header, Message, Segment } from 'semantic-ui-react';
import api from 'api';
import storage from 'utils/storage';

class SignIn extends Component {
  state = {
    email: '',
    password: ''
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
    api.signIn(this.getFormData())
      .then(res => {
        storage.set('access_token', res.data.access_token);
        // redirect to index
      })
      .catch(err => {

      });
  }

  render() {
    return (
      <div>
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
