import React, { Component } from 'react';
import { Segment, Label, Icon } from 'semantic-ui-react';
import './Window.css';

export default class Window extends Component {
  render() {
    return (
      <Segment className='Window'>
        <Label attached='top' color={this.props.titleColor}>
          {this.props.title}
        </Label>

        <div className='Window_content'>
          {this.props.children}
        </div>
      </Segment>
    );
  }

}
