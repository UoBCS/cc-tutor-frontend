import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Header, Message, Segment } from 'semantic-ui-react';
import api from 'api';
import storage from 'utils/storage';
import misc from 'utils/misc';

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    ui: misc.lazyClone(this.props.uiState)
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
    this.props.ui.loader.show(this, 'main');

    api.signIn(this.getFormData())
      .then(res => {
        this.props.ui.loader.hide(this, 'main');
        storage.set('access_token', res.data.access_token);
        this.props.history.push('/dashboard');
      })
      .catch(err => {
        this.props.ui.loader.hide(this, 'main');
        this.props.ui.message.show(this, 'negative', 'An error has occurred.', err.response.data.errors[0].detail);
      });
  }

  render() {
    return (
      <div>
        {this.props.ui.message.render(this)}
        {this.props.ui.loader.render(this, 'main')}

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
