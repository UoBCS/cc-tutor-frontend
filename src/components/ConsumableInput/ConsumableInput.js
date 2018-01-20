import React, { Component } from 'react';
import { Segment, Label } from 'semantic-ui-react';
import './ConsumableInput.css';

export default class ConsumableInput extends Component {

  createMarkup() {
    let str = this.props.content.data;
    let index = this.props.content.index;

    if (str !== null && index >= 0) {
      str = `${str.substring(0, index)}<span class='ConsumableInput_selected'>${str.charAt(index)}</span>${str.substring(index + 1)}`;
    }

    return {__html: str};
  }

  render() {
    return (
      <Segment className='ConsumableInput padded'>
        <Label attached='top left' color={this.props.titleColor}>{this.props.title}</Label>
        <p className='ConsumableInput_content' dangerouslySetInnerHTML={this.createMarkup()} />
      </Segment>
    );
  }

}
