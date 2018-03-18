import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Container, Grid, Menu, Segment } from 'semantic-ui-react';
import Introduction from './Introduction';
import Authentication from './Authentication';
import Errors from './Errors';
import BreakpointsObject from './BreakpointsObject';
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
              <Menu.Item as={Link} to='/'>Home</Menu.Item>

              <Menu.Item>
                <Menu.Header>TOPICS</Menu.Header>

                <Menu.Menu>
                  <Menu.Item name='introduction' active={activeItem === 'enterprise'} onClick={this.itemClick} />
                  <Menu.Item name='authentication' active={activeItem === 'consumer'} onClick={this.itemClick} />
                  <Menu.Item name='errors' active={activeItem === 'consumer'} onClick={this.itemClick} />
                  <Menu.Item name='objects' active={activeItem === 'consumer'} onClick={this.itemClick} />
                </Menu.Menu>
              </Menu.Item>

              <Menu.Item>
                <Menu.Header>Algorithms</Menu.Header>

                <Menu.Menu>
                  <Menu.Item name='rails' active={activeItem === 'rails'} onClick={this.itemClick} />
                  <Menu.Item name='python' active={activeItem === 'python'} onClick={this.itemClick} />
                  <Menu.Item name='php' active={activeItem === 'php'} onClick={this.itemClick} />
                </Menu.Menu>
              </Menu.Item>

              <Menu.Item>
                <Menu.Header>Hosting</Menu.Header>

                <Menu.Menu>
                  <Menu.Item name='shared' active={activeItem === 'shared'} onClick={this.itemClick} />
                  <Menu.Item name='dedicated' active={activeItem === 'dedicated'} onClick={this.itemClick} />
                </Menu.Menu>
              </Menu.Item>

              <Menu.Item>
                <Menu.Header>Support</Menu.Header>

                <Menu.Menu>
                  <Menu.Item name='email' active={activeItem === 'email'} onClick={this.itemClick}>
                    E-mail Support
                  </Menu.Item>

                  <Menu.Item name='faq' active={activeItem === 'faq'} onClick={this.itemClick}>
                    FAQs
                  </Menu.Item>
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
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
};
