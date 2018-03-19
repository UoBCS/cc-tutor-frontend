import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class TreeObject extends Component {
  render() {
    return (
      <div id='tree_object' className='ApiDocumentation_section'>
        <div className='ApiDocumentation_section_inner'>
          <Header as='h1'>Tree object</Header>

          <p>
            The tree object.
          </p>

          <Header as='h5' className='ApiDocumentation_list_title'>Attributes</Header>

          <ul className='ApiDocumentation_list_group'>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                name/node
                <span className='ApiDocumentation_list_item_label_extra'>string</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The name of the node.</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                children
                <span className='ApiDocumentation_list_item_label_extra'>array</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>An array of nodes.</p>
            </li>
          </ul>
        </div>
      </div>
    );
  }

}
