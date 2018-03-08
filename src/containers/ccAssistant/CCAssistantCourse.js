import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Card, Header, Button, Icon } from 'semantic-ui-react';
import DataPlaceholder from 'components/DataPlaceholder/DataPlaceholder';
import ui from 'utils/ui';
import api from 'api';
import clone from 'clone';

export default class CCAssistantCourse extends Component {

  state = {
    lessons: [],

    ui: clone(ui.state)
  }

  componentWillMount() {
    ui.obj.loader.show(this);
    this.initializers.getData();
  }

  initializers = {
    getData: () => {
      const courseId = this.props.match.params.id;

      api.cca.getLessons(courseId)
        .then(res => {
          ui.obj.loader.hide(this);
          this.setState({ lessons: res.data });
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
        });
    }
  }

  eventHandlers = {
    openLessonClickHandler: lessonId => () => {
      const courseId = this.props.match.params.id;
      this.props.history.push(`/cc-assistant/courses/${courseId}/lessons/${lessonId}`);
    }
  }

  render() {
    const lessons = this.state.lessons && this.state.lessons.length !== 0 ?
      (
        <div>
          <Header as='h3'>Lessons</Header>
          <Card.Group>
            {this.state.lessons.map(lesson => (
              <Card key={lesson.id}>
                <Card.Content>
                  <Card.Header>{lesson.title}</Card.Header>
                  <Card.Meta>{lesson.subtitle}</Card.Meta>
                </Card.Content>
                <Card.Content>
                  <Card.Description>
                    <p>{lesson.description}</p>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button onClick={this.eventHandlers.openLessonClickHandler(lesson.id)}>Open</Button>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </div>
      )
      :
      (
        <DataPlaceholder
          title='No lessons available'
          subtitle='Upcoming lessons will be displayed here.'
          icon='book'
        />
      );

    return (
      <Container style={{ marginTop: 30 }}>
        {ui.obj.loader.render(this)}

        <Menu pointing secondary>
          <Menu.Item>
            <Header as='h3' style={{ color: '#425164' }}>
              <Icon name='lab'/>
              <Header.Content>CC Tutor - Compiler Construction Assistant</Header.Content>
            </Header>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item name='back' as={Link} to='/cc-assistant' />
            <Menu.Item name='homepage' as={Link} to='/' />
            <Menu.Item name='dashboard' as={Link} to='/dashboard' />
            <Menu.Item name='logOut' />
          </Menu.Menu>
        </Menu>

        <div style={{ marginTop: 30 }}>
          {lessons}
        </div>
      </Container>
    );
  }

}
