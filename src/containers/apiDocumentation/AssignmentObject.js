import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class AssignmentObject extends Component {
  render() {
    return (
      <div id='assignment_object' className='ApiDocumentation_section'>
        <div className='ApiDocumentation_section_inner'>
          <Header as='h1'>Assignment object</Header>

          <Header as='h5' className='ApiDocumentation_list_title'>Attributes</Header>

          <ul className='ApiDocumentation_list_group'>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                title
                <span className='ApiDocumentation_list_item_label_extra'>string, required</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The title of the assignment.</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                type
                <span className='ApiDocumentation_list_item_label_extra'>string</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>One of the following: <span className='ApiDocumentation_mono'>'impl_general', 'regex_to_nfa', 'nfa_to_dfa', 'll', 'lr', 'll1', 'lr0', 'cek_machine'</span>.</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                description
                <span className='ApiDocumentation_list_item_label_extra'>array, optional</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The description of the assignment.</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                due_date
                <span className='ApiDocumentation_list_item_label_extra'>array, optional</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The due date of the assignment.</p>
            </li>
          </ul>
        </div>
      </div>
    );
  }

}
