import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment
} from 'semantic-ui-react';

import auth from 'utils/auth';
import api from 'api';

export default class Homepage extends Component {
  state = {
    authenticated: false
  }

  eventHandlers = {
    logoutClick: () => {
      api.logOut()
        .then(res => {

        })
        .catch(err => {

        });
    },

    getStartedClick: () => {
      this.props.history.push(this.state.authenticated ? '/dashboard' : '/sign-in');
    }
  }

  componentWillMount() {
    auth.isAuthenticated()
      .then(res => {
        this.setState({ authenticated: true });
      })
      .catch(err => {
        this.setState({ authenticated: false });
      })
  }

  render() {
    const rightMenu = this.state.authenticated
      ?
      <Menu.Item position='right'>
        <Button as={Link} to='/dashboard' inverted>Dashboard</Button>
        <Button onClick={this.eventHandlers.logoutClick} inverted style={{ marginLeft: '0.5em' }}>Log out</Button>
      </Menu.Item>
      :
      <Menu.Item position='right'>
        <Button as={Link} to='/sign-in' inverted>Sign in</Button>
        <Button as={Link} to='/sign-up' inverted style={{ marginLeft: '0.5em' }}>Sign Up</Button>
      </Menu.Item>

    return (
      <div>
        <Segment
          inverted
          textAlign='center'
          style={{ minHeight: 700, padding: '1em 0em' }}
          vertical
        >
          <Container>
            <Menu inverted pointing secondary size='large'>
              <Menu.Item as={Link} to='/' active>Home</Menu.Item>
              <Menu.Item as={Link} to='/api-documentation'>API</Menu.Item>
              {rightMenu}
            </Menu>
          </Container>

          <Container text>
            <Header
              as='h1'
              content='CC Tutor'
              inverted
              style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0, marginTop: '3em' }}
            />
            <Header
              as='h2'
              content='A compilation process visualization platform.'
              inverted
              style={{ fontSize: '1.7em', fontWeight: 'normal' }}
            />
            <Button primary size='huge' onClick={this.eventHandlers.getStartedClick}>
              Get Started
              <Icon name='right arrow' />
            </Button>
          </Container>
        </Segment>

        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign='middle'>
            <Grid.Row>
              <Grid.Column>
                <Header as='h3' style={{ fontSize: '2em' }}>Models of Computation Algorithms Included</Header>
                <p style={{ fontSize: '1.33em' }}>
                  Models of Computation is a fundamental module in the formation of a computer science student.
                  CC Tutor includes some automata theory algorithms. In the future it will include more
                  of them, such as the Turing Machine.
                </p>
                <Header as='h3' style={{ fontSize: '2em' }}>Frontend Compilaton Process Visualization</Header>
                <p style={{ fontSize: '1.33em' }}>
                  With CC Tutor you can visualize the frontend compilation process.
                </p>
                <Header as='h3' style={{ fontSize: '2em' }}>Compiler Construction Assistant</Header>
                <p style={{ fontSize: '1.33em' }}>
                  The Compiler Construction Assistant gives you the possiblity to test your understanding
                  of the frontend compilation process by implementing on your own.
                </p>
                <Header as='h3' style={{ fontSize: '2em' }}>Test Understanding Through Assignments</Header>
                <p style={{ fontSize: '1.33em' }}>
                  Teachers can submit assignments regarding any algorithm in CC Tutor.
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column textAlign='center'>
                <Button size='huge' onClick={this.eventHandlers.getStartedClick}>Check Them Out</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment style={{ padding: '0em' }} vertical>
          <Grid celled='internally' columns='equal' stackable>
            <Grid.Row textAlign='center'>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as='h3' style={{ fontSize: '2em' }}>"The CCA is a useful tool for testing and implementing the frontend."</Header>
                <p style={{ fontSize: '1.33em' }}>4th year MSci student</p>
              </Grid.Column>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as='h3' style={{ fontSize: '2em' }}>"Overall it's a simple to use tool"</Header>
                <p style={{ fontSize: '1.33em' }}>3rd year BSc student</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment inverted vertical style={{ padding: '5em 0em' }}>
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Header inverted as='h4' content='About' />
                  <List link inverted>
                    <List.Item>Contact: ossedb@gmail.com</List.Item>
                    <List.Item as={Link} to='https://github.com/UoBCS/cc-tutor-backend'>Backend Repository</List.Item>
                    <List.Item as={Link} to='https://github.com/UoBCS/cc-tutor-frontend'>Frontend Repository</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Header inverted as='h4' content='Services' />
                  <List link inverted>
                    <List.Item as={Link} to='/api-documentation'>API Documentation</List.Item>
                    <List.Item as={Link} to='https://github.com/UoBCS/cc-tutor-frontend/issues/new'>Found a Bug?</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={7}>
                  <Header as='h4' inverted>Get Access!</Header>
                  <p>Register or login to get access to all features provided by CC Tutor.</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </div>
    )
  }
}
