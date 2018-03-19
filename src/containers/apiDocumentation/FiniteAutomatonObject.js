import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class FiniteAutomatonObject extends Component {
  render() {
    return (
      <div id='finite_automaton_object' className='ApiDocumentation_section'>
        <div className='ApiDocumentation_section_inner'>
          <Header as='h1'>Finite Automaton object</Header>

          <p>
            The finite automaton object defines a finite automaton, its states and transitions.
            It is an array of transition objects with the following attributes:
          </p>

          <Header as='h5' className='ApiDocumentation_list_title'>Attributes</Header>

          <ul className='ApiDocumentation_list_group'>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                src
                <span className='ApiDocumentation_list_item_label_extra'>state</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The source state (with attributes: "id", "final" and "data").</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                char
                <span className='ApiDocumentation_list_item_label_extra'>string</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The transition character.</p>
            </li>
            <li className='ApiDocumentation_list_item'>
              <Header as='h3' className='ApiDocumentation_list_item_label'>
                dest
                <span className='ApiDocumentation_list_item_label_extra'>state</span>
              </Header>
              <p className='ApiDocumentation_list_item_description'>The destination state (with attributes: "id", "final" and "data").</p>
            </li>
          </ul>
        </div>
      </div>
    );
  }

}
