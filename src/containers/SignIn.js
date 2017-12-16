import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Header, Message, Segment } from 'semantic-ui-react';

const SignIn = () => (
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
        />
        <Form.Input
          fluid
          icon='lock'
          iconPosition='left'
          placeholder='Password'
          type='password'
        />

        <Button color='teal' fluid size='large'>Login</Button>
      </Segment>
    </Form>
    <Message>
      New to CC Tutor? <Link to='/sign-up'>Sign Up</Link> | <Link to='/'>Home</Link>
    </Message>
  </div>
)

export default SignIn
