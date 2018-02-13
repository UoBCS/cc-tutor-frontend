import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Card, Dimmer, Loader, Header, Button, Icon } from 'semantic-ui-react';
import misc from 'utils/misc';
import ui from 'utils/ui';
import api from 'api';
import clone from 'clone';

export default class CCAssistant extends Component {

  state = {
    courses: [],

    userCourses: [],

    ui: clone(ui.state)
  }

  componentWillMount() {
    ui.obj.loader.show(this);
    this.initializers.getData();
  }

  initializers = {
    getData: () => {
      api.cca.getCourses()
        .then(res => {
          this.setState({
            courses: res.data.courses,
            userCourses: res.data.user_courses
          }, () => {
            ui.obj.loader.hide(this);
          });
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          // TODO: error
        });
    }
  }

  eventHandlers = {
    submitToCourseClickHandler: courseId => {
      return () => {
        //this.props.history.push(`/cc-assistant/courses/${courseId}`);

        const success = res => {
          ui.obj.loader.hide(this);

          this.props.history.push({
            pathname: `/cc-assistant/courses/${courseId}/lessons/${res.data.id}`,
            state: { lessonData: res.data }
          });
        };

        const error = err => {
          ui.obj.loader.hide(this);
        };

        ui.obj.loader.show(this);

        api.cca.subscribeToCourse(courseId)
          .then(success)
          .catch(error);
      }
    },

    resumeClickHandler: courseId => {
      return () => {
        const success = res => {
          ui.obj.loader.hide(this);

          this.props.history.push({
            pathname: `/cc-assistant/courses/${courseId}/lessons/${res.data.id}`,
            state: { lessonData: res.data }
          });
        };

        const error = err => {
          ui.obj.loader.hide(this);
        };

        ui.obj.loader.show(this);

        api.cca.getCurrentLesson(courseId)
          .then(success)
          .catch(error);
      }
    },

    resetProgressClickHandler: courseId => {
      return () => {
        const success = res => {
          ui.obj.loader.hide(this);

          this.setState({
            userCourses: misc.removeWhere(this.state.userCourses, 'id', courseId)
          });
        };

        const error = err => {
          ui.obj.loader.hide(this);
        }

        ui.obj.loader.show(this);

        api.cca.unsubscribeFromCourse(courseId)
          .then(success)
          .catch(error);
      }
    }
  }

  render() {
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
                  <Button onClick={this.eventHandlers.resumeClickHandler(course.id)}>Resume</Button>
                  <p style={{ display: 'inline-block', fontSize: 11, marginLeft: 13 }}>
                    <a onClick={this.eventHandlers.resetProgressClickHandler(course.id)}><Icon name='refresh' /> Reset Progress</a>
                  </p>
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
              <Card key={course.id}>
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
                  <Button onClick={this.eventHandlers.submitToCourseClickHandler(course.id)}>Start</Button>
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
            <Header as='h3' style={{ color: '#425164' }}>
              <Icon name='lab'/>
              <Header.Content>CC Tutor - Compiler Construction Assistant</Header.Content>
            </Header>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item name='homepage' as={Link} to='/' />
            <Menu.Item name='dashboard' as={Link} to='/dashboard' />
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
