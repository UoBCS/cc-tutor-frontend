import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Header, Message, Segment } from 'semantic-ui-react';

const SignUp = () => (
  <div>
    <Header as='h2' color='teal' textAlign='center'>
      Sign-up to CC Tutor
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
      Already have an account? <Link to='/sign-in'>Sign In</Link> | <Link to='/'>Home</Link>
    </Message>
  </div>
)

export default SignUp
