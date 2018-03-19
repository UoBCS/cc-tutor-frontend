import React, { Component } from 'react';
import { Form, Icon } from 'semantic-ui-react';

export default class TokenInput extends Component {

  getData = () => ({
      name: document.querySelector(`[name="ti-name-${this.props.id}"]`).value,
      regex: document.querySelector(`[name="ti-regex-${this.props.id}"]`).value,
      priority: parseInt(document.querySelector(`[name="ti-priority-${this.props.id}"]`).value),
      skippable: document.querySelector(`[name="ti-skippable-${this.props.id}"]`).checked
  })

  render() {
    return (
      <Form.Group widths='equal'>
        <Form.Input name={`ti-name-${this.props.id}`} className='monospace-input' fluid label='Name' placeholder='Name' />
        <Form.Input name={`ti-regex-${this.props.id}`} className='monospace-input' fluid label='Regex' placeholder='Regex' />
        <Form.Input name={`ti-priority-${this.props.id}`} className='monospace-input' fluid label='Priority' placeholder='Priority' type='number' />
        <Form.Checkbox name={`ti-skippable-${this.props.id}`} label='Skippable' />
        <Icon link circular inverted color='red' name='x' onClick={this.props.onDeleteClickHandler} />
      </Form.Group>
    )
  }

}
