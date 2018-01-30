import React, { Component } from 'react';
import { Segment, Label } from 'semantic-ui-react';
import './Stack.css';

export default class Stack extends Component {

  render() {
    const stack = this.props.stack !== null
                  ? this.props.stack.map(this.props.render)
                  : null;

    return (
      <div className='Stack'>
        <div className='Stack_wrapper'>
          {stack}
        </div>
      </div>
    );
  }

}
