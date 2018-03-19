import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class Phases extends Component {
  render() {
    return (
      <div id='phases' className='ApiDocumentation_section'>
        <div className='ApiDocumentation_section_inner'>
          <Header as='h1'>Phases</Header>

          <p>
            This endpoint includes the phases of the compiler's frontend.
          </p>

          <pre>
            /phases
          </pre>

        </div>
      </div>
    );
  }

}
