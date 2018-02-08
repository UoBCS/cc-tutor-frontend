import React, { Component } from 'react';
import { Card, Header } from 'semantic-ui-react';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Header as='h3'>Upcoming assignments</Header>
        <Card.Group>
          <Card
            href='#card-example-link-card'
            header='Elliot Baker'
            meta='Friend'
            description='Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat.'
          />
        </Card.Group>

        <Header as='h3'>Algorithms</Header>
        <Card.Group>
          <Card
            href='/dashboard/regex2nfa'
            header='Regular expression to NFA'
            description='Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat.'
          />
          <Card
            href='/dashboard/nfa2dfa'
            header='NFA to DFA'
            description='Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat.'
          />
        </Card.Group>
      </div>
    );
  }
}

export default Dashboard;
