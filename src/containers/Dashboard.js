import React, { Component } from 'react';
import { Card, Header } from 'semantic-ui-react';

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <Header as='h3'>Algorithms and phases</Header>
        <Card.Group>
          <Card
            href='/dashboard/regex2nfa'
            header='Regular expression to NFA'
            description='Learn how to transform a regular expression to a non-deterministic finite automaton.'
          />
          <Card
            href='/dashboard/nfa2dfa'
            header='NFA to DFA'
            description='Learn how to modify a non-deterministic finite automaton to a deterministic one, through subset construction.'
          />
          <Card
            href='/dashboard/dfa-minimization'
            header='DFA minimization'
            description='Learn about the minimization process of a deterministic finite automaton.'
          />
          <Card
            href='/dashboard/ll'
            header='LL parsing'
            description='Learn and interact with the LL top-down parsing process. This is non-deterministic as it does not use lookahead.'
          />
          <Card
            href='/dashboard/ll1'
            header='LL(1) parsing'
            description='Learn how the LL(1) parsing works through the FIRST and FOLLOW sets construction.'
          />
          <Card
            href='/dashboard/lr'
            header='LR parsing'
            description='Learn and interact with the LR bottom-up parsing process. This is non-deterministic and you have to appropriately choose the "reduce" or "shift" actions.'
          />
          <Card
            href='/dashboard/lr0'
            header='LR(0) parsing'
            description='Learn how the LR(0) parsing works through the items DFA construction.'
          />
          <Card
            href='/dashboard/semantic-analysis'
            header='Semantic analysis'
            description='Learn how an AST is constructed. Phases such as type checking will be implemented in the next version.'
          />
        </Card.Group>
      </div>
    );
  }
}
