import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Card, Dimmer, Loader, Header, Button, Icon } from 'semantic-ui-react';
import ui from 'utils/ui';
import clone from 'clone';

export default class CCAssistant extends Component {

  state = {
    courses: [
      {
        title: 'Lexical Analysis',
        subtitle: 'Compiler frontend',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at odio nisi. Donec ac nisl tortor. Aliquam porta arcu vel ex condimentum consequat.',
      }
    ],

    userCourses: [
      {
        title: 'Lexical Analysis',
        subtitle: 'Compiler frontend',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at odio nisi. Donec ac nisl tortor. Aliquam porta arcu vel ex condimentum consequat.',
        progress: 33
      }
    ],

    ui: clone(ui.state)
  }

  componentWillMount() {
    this.initializers.getUserCourses();
  }

  initializers = {
    getUserCourses: () => {

    }
  }

  render() {
    const isLoading = this.state.courses === null || this.state.userCourses === null;

    const userCoursesContent = this.state.userCourses && this.state.userCourses.length !== 0 ?
      (
        <div style={{ marginBottom: 44 }}>
          <Header as='h3'>Continue learning</Header>
          <Card.Group>
            {this.state.userCourses.map(course => (
              <Card key={course.title}>
                <Card.Content>
                  <Card.Header>{course.title}</Card.Header>
                  <Card.Meta>{course.subtitle}</Card.Meta>
                </Card.Content>
                <Card.Content>
                  <Card.Description>
                    <p>{course.description}</p>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button>Resume {course.progress}%</Button>
                  <p style={{ display: 'inline-block', fontSize: 11, marginLeft: 13 }}><a><Icon name='refresh' /> Reset Progress</a></p>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </div>
      )
      :
      null;

    const coursesContent = this.state.courses && this.state.courses.length !== 0 ?
      (
        <div>
          <Header as='h3'>Available courses</Header>
          <Card.Group>
            {this.state.courses.map(course => (
              <Card key={course.title}>
                <Card.Content>
                  <Card.Header>{course.title}</Card.Header>
                  <Card.Meta>{course.subtitle}</Card.Meta>
                </Card.Content>
                <Card.Content>
                  <Card.Description>
                    <p>{course.description}</p>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button>Start</Button>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </div>
      )
      :
      null;

    return (
      <Container style={{ marginTop: 30 }}>
        {ui.obj.loader.render(this)}

        <Menu pointing secondary>
          <Menu.Item>
            <Header as='h1' style={{ color: '#425164', fontSize: 24 }}>
              <Icon name='lab'/>
              <Header.Content>CC Tutor</Header.Content>
            </Header>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item name='homepage' as={Link} to='/' />
            <Menu.Item name='dashboard' as={Link} to='/dashboard' />
            <Menu.Item name='courses' />
            <Menu.Item name='logOut' />
          </Menu.Menu>
        </Menu>

        <div style={{ marginTop: 30 }}>
          {userCoursesContent}

          {coursesContent}
        </div>
      </Container>
    );
  }

}

