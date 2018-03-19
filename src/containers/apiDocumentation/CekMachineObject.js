import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class CekMachineObject extends Component {
  render() {
    return (
      <div id='cek_machine_object' className='ApiDocumentation_section'>
        <div className='ApiDocumentation_section_inner'>
          <Header as='h1'>CEK machine object</Header>

          <p>
            The CEK machine object.
          </p>

          <Header as='h5' className='ApiDocumentation_list_title'>Attributes</Header>

          <ul className='ApiDocumentation_list_group'>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                control
                <span className='ApiDocumentation_list_item_label_extra'>string, required</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The control of the machine.</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                environment
                <span className='ApiDocumentation_list_item_label_extra'>array, optional</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The environment of the machine.</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                continuation
                <span className='ApiDocumentation_list_item_label_extra'>array, optional</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The continuation of the machine.</p>
            </li>
          </ul>
        </div>
      </div>
    );
  }

}
