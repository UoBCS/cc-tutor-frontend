import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class CourseObject extends Component {
  render() {
    return (
      <div id='course_object' className='ApiDocumentation_section'>
        <div className='ApiDocumentation_section_inner'>
          <Header as='h1'>Course object</Header>

          <Header as='h5' className='ApiDocumentation_list_title'>Attributes</Header>

          <ul className='ApiDocumentation_list_group'>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                title
                <span className='ApiDocumentation_list_item_label_extra'>string, required</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The title of the course.</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                subtitle
                <span className='ApiDocumentation_list_item_label_extra'>string</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The subtitle of the course.</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                description
                <span className='ApiDocumentation_list_item_label_extra'>string</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The description of the course.</p>
            </li>
          </ul>
        </div>
      </div>
    );
  }

}
