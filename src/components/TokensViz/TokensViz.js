import React, { Component } from 'react';
import { Segment, Label } from 'semantic-ui-react';

export default class TokensViz extends Component {

  render() {
    let tokens = null;

    if (this.props.tokens !== null) {
      const currentIndex = this.props.tokens.index;
      tokens = this.props.tokens.data === null ? null
      : this.props.tokens.data.map((token, idx) => (
        <Label style={{ marginBottom: 6 }} key={idx} as='a' color={idx === currentIndex ? 'blue' : null}>
          {token.text}
          <Label.Detail>
            {token.type.name !== undefined ? token.type.name : token.type} Line {token.line}, Column {token.column}
          </Label.Detail>
        </Label>
      ));
    }

    return (
      <div>
        {tokens}
      </div>
    );
  }

}
