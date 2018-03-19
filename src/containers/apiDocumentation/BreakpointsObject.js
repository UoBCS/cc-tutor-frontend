import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class BreakpointsObject extends Component {
  render() {
    return (
      <div className='ApiDocumentation_section'>
        <div id='breakpoints_object' className='ApiDocumentation_section_inner'>
          <Header as='h1'>Breakpoints object</Header>

          <p>
            For visualization purposes each algorithm execution
            is traced. Each execution step is called a breakpoint with the attributes described below.
          </p>

          <Header as='h5' className='ApiDocumentation_list_title'>Attributes</Header>

          <ul className='ApiDocumentation_list_group'>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                label
                <span className='ApiDocumentation_list_item_label_extra'>string, required</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The unique label identifier of the step within an algorithm (i.e. collection of breakpoints).</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                data
                <span className='ApiDocumentation_list_item_label_extra'>any, optional</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The data associated with the label which describes the algorithm step.</p>
            </li>
          </ul>
        </div>
      </div>
    );
  }

}
