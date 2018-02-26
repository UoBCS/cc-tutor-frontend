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
      ui.obj.loader.show(this);

      api.assignments.get(this.props.match.params.id)
        .then(res => {
          ui.obj.loader.hide(this);
          this.setState({ assignment: res.data });
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
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
    const { assignment } = this.state;

    return (
      <div className='dashboard-card'>
        {ui.obj.loader.render(this)}

        <div className='dashboard-card-header'>
          <Header
              as='h1'
              className='light-heading'>

              {assignment === null ? 'Assignment' : `Assignment: ${assignment.title}`}
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
