import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class Users extends Component {
  render() {
    return (
      <div id='users' className='ApiDocumentation_section'>
        <div className='ApiDocumentation_section_inner'>
          <Header as='h1'>Users</Header>

          <p>
            This endpoint includes the user segments.
          </p>

          <pre>
            /users
          </pre>

        </div>
      </div>
    );
  }

}
