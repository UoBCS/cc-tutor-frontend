import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Header, Message, Segment, Radio } from 'semantic-ui-react';
import api from 'api';
import misc from 'utils/misc';

class SignUp extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    teacher: false,
    ui: misc.lazyClone(this.props.uiState)
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
    this.props.ui.loader.show(this, 'main');

    api.signUp(this.getFormData())
      .then(res => {
        this.props.ui.loader.hide(this, 'main');
        this.props.ui.message.show(this, 'positive', 'You have been successfully signed up.', 'Check your email to activate your account.');
      })
      .catch(err => {
        this.props.ui.loader.hide(this, 'main');
        this.props.ui.message.show(this, 'negative', 'An error has occurred.', 'An error has occurred when signing up.');
      });

    this.resetInput();
  }

  render() {
    return (
      <div>
        {this.props.ui.message.render(this)}
        {this.props.ui.loader.render(this, 'main')}

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
