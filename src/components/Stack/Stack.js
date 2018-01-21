import React, { Component } from 'react';
import { Segment, Label } from 'semantic-ui-react';
import './Stack.css';

export default class Stack extends Component {

  render() {
    const stack = this.props.stack !== null
                  ? this.props.stack.map(this.props.render)
                  : null;

    return (
      <Segment className='Stack'>
        <Label as='a' color='teal' ribbon='right'>{this.props.title || 'Stack'}</Label>
        <div className='Stack_wrapper'>
          {stack}
        </div>
      </Segment>
    );
  }

}
