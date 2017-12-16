import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Header, Message, Segment, Radio } from 'semantic-ui-react';
import api from 'api';

class SignUp extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    teacher: false,
    confirmationMessage: false,
    errorMessage: false
  }

  getFormData = () => {
    let keys = ['name', 'email', 'password', 'teacher'];
    let obj = {};
    keys.forEach(k => obj[k] = this.state[k]);
    return obj;
  }

  resetInput = () => {
    this.setState({
      name: '',
      email: '',
      password: '',
      teacher: false
    });
  }

  handleInputChange = event => {
    const target = event.target;

    this.setState({
      [target.name]: target.value
    });
  }

  handleRadioChange = (event, { value }) => {
    this.setState({
      teacher: value === 'teacher'
    });
  }

  handleSignUpClick = () => {
    api.signUp(this.getFormData())
      .then(res => {
        this.setState({ confirmationMessage: true });
      })
      .catch(err => {
        this.setState({ errorMessage: true });
      });

    this.resetInput();
  }

  render() {
    return (
      <div>
        {this.state.confirmationMessage &&
          <Message positive>
            <Message.Header>You have been successfully signed up.</Message.Header>
            <p>Check your email to activate your account.</p>
          </Message>
        }

        {this.state.errorMessage &&
          <Message positive>
            <Message.Header>An error has occurred.</Message.Header>
            <p>An error has occurred when signing up.</p>
          </Message>
        }

        <Header as='h2' color='teal' textAlign='center'>
          Sign-up to CC Tutor
        </Header>
        <Form size='large'>
          <Segment stacked>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Full name'
              name='name'
              value={this.state.name}
              onChange={this.handleInputChange}
            />
            <Form.Input
              fluid
              icon='at'
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
              type='password'
              name='password'
              value={this.state.password}
              onChange={this.handleInputChange}
            />
            <Form.Field>
              <Radio
                label='Student'
                name='teacher'
                value='student'
                checked={!this.state.teacher}
                onChange={this.handleRadioChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label='Teacher'
                name='teacher'
                value='teacher'
                checked={this.state.teacher}
                onChange={this.handleRadioChange}
              />
            </Form.Field>

            <Button color='teal' fluid size='large' onClick={this.handleSignUpClick}>
              Sign up
            </Button>
          </Segment>
        </Form>
        <Message>
          Already have an account? <Link to='/sign-in'>Sign In</Link> | <Link to='/'>Home</Link>
        </Message>
      </div>
    )
  }
}

export default SignUp;
