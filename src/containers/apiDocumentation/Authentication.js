import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class Authentication extends Component {
  render() {
    return (
      <div id='authentication' className='ApiDocumentation_section'>
        <div className='ApiDocumentation_section_inner'>
          <Header as='h1'>Authentication</Header>

          <p>
            Authentication stuff here.
          </p>
        </div>
      </div>
    );
  }

}
