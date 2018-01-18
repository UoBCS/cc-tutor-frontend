import React, { Component } from 'react';
import { Segment, Label } from 'semantic-ui-react';

export default class TokensViz extends Component {

  render() {
    const currentIndex = this.props.tokens.index;
    const tokens = this.props.tokens.data === null ? null
    : this.props.tokens.data.map((token, idx) => (
      <Label key={idx} as='a' color={idx === currentIndex ? 'blue' : null}>
        {token.text}
        <Label.Detail>{token.type} Line {token.line}, Column {token.column}</Label.Detail>
      </Label>
    ));

    return (
      <Segment className='TokensViz' padded>
        <Label attached='top left' color='teal'>Tokens</Label>
        <div>
          {tokens}
        </div>
      </Segment>
    );
  }

}
