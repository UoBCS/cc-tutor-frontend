import React, { Component } from 'react';
import { Segment, Label, Icon } from 'semantic-ui-react';
import './Window.css';

export default class Window extends Component {
  render() {
    return (
      <Segment className='Window'>
        <Label className='Window_header' attached='top' color={this.props.titleColor}>
          {this.props.title}
          <div className='Window_actions'>
            <Icon link className='rgl-handle' name='move' />
          </div>
        </Label>

        <div className='Window_content'>
          {this.props.children}
        </div>
      </Segment>
    );
  }

}
