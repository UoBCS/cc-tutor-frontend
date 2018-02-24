import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';
import api from 'api';

export default class ConfirmClassInvitation extends Component {
  componentWillMount() {
    api.confirmClassInvitation(this.props.match.params.token)
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
          content='You have successfully been registered to the class'
          style={{ fontSize: '4em', fontWeight: 'normal', marginTop: '1.3em' }}
        />

        <Header as='h2'>
          Head over to the <Link to='/dashboard'>CC Tutor dashboard</Link>.
        </Header>
      </Container>
    );
  }
}
