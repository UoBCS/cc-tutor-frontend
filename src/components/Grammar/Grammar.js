import React, { Component } from 'react';
import { Icon, Segment, Label } from 'semantic-ui-react';

export default class Grammar extends Component {

  render() {
    let grammar = null;

    if (this.props.grammar !== null) {
      const productions = this.props.grammar.productions;
      const startSymbol = this.props.grammar.start_symbol;

      grammar = Object.keys(productions).map((lhs, lhsIdx) => (
        <div key={lhsIdx} style={{ marginBottom: 10, fontFamily: 'monospace' }}>
          <Label
                as='a'
                color={startSymbol === lhs ? 'red' : 'grey' }
                size='large'>
            {lhs}
          </Label>
          <Icon name='long arrow right' />
          {productions[lhs].map((rhs, rhsIdx) => (
            <Label key={'' + lhsIdx + rhsIdx}
                  as='a'
                  size='large'
                  onClick={this.props.productionClickHandler ? this.props.productionClickHandler(lhs, rhs) : null}>
              {rhs === null ? 'ɛ' : rhs.join(' ')}
            </Label>
          ))}
        </div>
      ));
    }

    return grammar;
  }

}
