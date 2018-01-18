import React, { Component } from 'react';
import { Segment, Label } from 'semantic-ui-react';
import './Stack.css';

export default class Stack extends Component {

  render() {
    const stack = this.props.stack.map(this.props.render);

    return (
      <Segment className='Stack'>
        <Label as='a' color='teal' ribbon='right'>State stack</Label>

        {stack}
      </Segment>
    );
  }

}
