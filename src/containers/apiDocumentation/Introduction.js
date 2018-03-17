import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class Introduction extends Component {
  render() {
    return (
      <div className='ApiDocumentation_section'>
        <div className='ApiDocumentation_section_inner'>
          <Header as='h1'>API Reference</Header>

          <p>
            The CC Tutor API is organized around REST.
            Our API has predictable, resource-oriented URLs, and uses HTTP response codes to indicate API errors.
            We use built-in HTTP features, like HTTP authentication and HTTP verbs, which are understood by
            off-the-shelf HTTP clients. We support cross-origin resource sharing, allowing you to interact
            securely with our API from a client-side web application. JSON is returned by all API responses, including errors.
          </p>
        </div>
      </div>
    );
  }

}
