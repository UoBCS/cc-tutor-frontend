import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';
import api from 'api';

class VerifyEmail extends Component {
  componentWillMount() {
    api.verifyEmail(this.props.match.params.token)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <Container>
        <Header
          as='h1'
          content='Welcome to CC Tutor'
          style={{ fontSize: '4em', fontWeight: 'normal', marginTop: '1.3em' }}
        />

        <Header as='h2'>
          Your email has been verified. Now you can <Link to='/sign-in'>sign in</Link>.
        </Header>
      </Container>
    );
  }
}

export default VerifyEmail;
