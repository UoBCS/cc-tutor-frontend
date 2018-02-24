import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import clone from 'clone';
import api from 'api';
import ui from 'utils/ui';

export default class Assignment extends Component {

  state = {
    assignment: null,
    ui: clone(ui.state)
  }

  initializers = {
    getData: () => {
      api.assignments.get(this.props.match.params.id)
        .then(res => {

        })
        .catch(err => {

        });
    }
  }

  renderers = {
    content: () => {
      return null;
    }
  }

  componentWillMount() {
    this.initializers.getData();
  }

  render() {
    // {ui.obj.loader.render(this)}
    const { assignment } = this.state;

    return assignment === null ? null : (
      <div className='dashboard-card'>
        <div className='dashboard-card-header'>
          <Header
              as='h1'
              className='light-heading'>

              Assignments: {assignment.title}
            </Header>
        </div>

        <div className='dashboard-card-content'>
          {ui.obj.message.render(this)}

          {this.renderers.content()}
        </div>
      </div>
    );
  }

}
