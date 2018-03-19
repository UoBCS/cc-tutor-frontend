import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Container, Grid, Menu, Segment } from 'semantic-ui-react';
import Introduction from './Introduction';
import Authentication from './Authentication';
import Errors from './Errors';
import BreakpointsObject from './BreakpointsObject';
import FiniteAutomatonObject from './FiniteAutomatonObject';
import TreeObject from './TreeObject';
import CekMachineObject from './CekMachineObject';
import AssignmentObject from './AssignmentObject';
import CourseObject from './CourseObject';
import LessonObject from './LessonObject';
import Algorithms from './Algorithms';
import Assignments from './Assignments';
import CompilerConstructionAssistant from './CompilerConstructionAssistant';
import Phases from './Phases';
import Users from './Users';
import './ApiDocumentation.css';

export default class ApiDocumentation extends Component {

  eventHandlers = {
    itemClick: name => this.setState({ activeItem: name })
  }

  render() {
    const { activeItem } = this.state || {}

    return (
      <Container className='ApiDocumentation'>
        <Grid>
          <Grid.Column width={3}>
            <Menu vertical>
              <Menu.Item as='a' href='/'>Home</Menu.Item>

              <Menu.Item>
                <Menu.Header>TOPICS</Menu.Header>

                <Menu.Menu>
                  <Menu.Item name='introduction' as='a' href='#introduction' />
                  <Menu.Item name='authentication' as='a' href='#authentication' />
                  <Menu.Item name='errors' as='a' href='#errors' />
                </Menu.Menu>
              </Menu.Item>

              <Menu.Item>
                <Menu.Header>OBJECTS</Menu.Header>

                <Menu.Menu>
                  <Menu.Item name='breakpointsObject' as='a' href='#breakpoints_object' />
                  <Menu.Item name='finiteAutomatonObject' as='a' href='#finite_automaton_object' />
                  <Menu.Item name='treeObject' as='a' href='#tree_object' />
                  <Menu.Item name='CEKMachineObject' as='a' href='#cek_machine_object' />
                  <Menu.Item name='assignmentObject' as='a' href='#assignment_object' />
                  <Menu.Item name='courseObject' as='a' href='#course_object' />
                  <Menu.Item name='lessonObject' as='a' href='#lesson_object' />
                </Menu.Menu>
              </Menu.Item>

              <Menu.Item>
                <Menu.Header>ENDPOINTS</Menu.Header>

                <Menu.Menu>
                  <Menu.Item name='algorithms' as='a' href='#algorithms' />
                  <Menu.Item name='assignments' as='a' href='#assignments' />
                  <Menu.Item name='compilerConstructionAssistant' as='a' href='#compiler_construction_assistant' />
                  <Menu.Item name='phases' as='a' href='#phases' />
                  <Menu.Item name='users' as='a' href='#users' />
                </Menu.Menu>
              </Menu.Item>
            </Menu>
          </Grid.Column>

          <Grid.Column width={13}>
            <Segment className='ApiDocumentation_content'>
              <Introduction />
              <Authentication />
              <Errors />
              <BreakpointsObject />
              <FiniteAutomatonObject />
              <TreeObject />
              <CekMachineObject />
              <AssignmentObject />
              <CourseObject />
              <LessonObject />
              <Algorithms />
              <Assignments />
              <CompilerConstructionAssistant />
              <Phases />
              <Users />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
};
