import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class Introduction extends Component {
  render() {
    return (
      <div id='errors' className='ApiDocumentation_section'>
        <div className='ApiDocumentation_section_inner'>
          <Header as='h1'>Errors</Header>

          <p>
            CC Tutor uses conventional HTTP response codes to indicate the success or failure of an API request.
            In general, codes in the 2xx range indicate success, codes in the 4xx range indicate an error that
            failed given the information provided (e.g., a required parameter was omitted, etc.),
            and codes in the 5xx range indicate an error with CC Tutor's servers (these are rare).
          </p>

          <Header as='h5' className='ApiDocumentation_list_title'>Attributes</Header>

          <ul className='ApiDocumentation_list_group'>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>status</Header>
              <p className='ApiDocumentation_list_item_description'>The HTTP status code applicable to this problem, expressed as a string value.</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>code</Header>
              <p className='ApiDocumentation_list_item_description'>An application-specific error code, expressed as a string value.</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>title</Header>
              <p className='ApiDocumentation_list_item_description'>A short, human-readable summary of the problem.</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>detail</Header>
              <p className='ApiDocumentation_list_item_description'>A human-readable explanation specific to this occurrence of the problem.</p>
            </li>
          </ul>
        </div>
      </div>
    );
  }

}
