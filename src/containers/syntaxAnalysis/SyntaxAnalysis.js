import React, { Component } from 'react';
import { Card, Grid, Header, Button } from 'semantic-ui-react';

export default class SyntaxAnalysis extends Component {

  render() {
    return (
      <div className='dashboard-card'>
        <div className='dashboard-card-header'>
          <Grid className='viz-heading'>
            <Grid.Column floated='left' width={9} className='viz-heading-left '>
              <Header
                as='h1'
                className='light-heading'>
                Syntax Analysis
              </Header>
              <p>
                Select a parsing type. You can choose deterministic or non-deterministic ones. In each
                one of them you can choose between top-down (LL) and bottom-up (LR) parsing.
              </p>
            </Grid.Column>
            <Grid.Column floated='right' width={1}>
              <Button
                circular
                icon='question'
                color='blue'
                style={{ float: 'right' }}/>
              <br style={{ clear: 'both' }}/>
            </Grid.Column>
          </Grid>
        </div>

        <div className='dashboard-card-content'>
          <Card.Group>
            <Card
              href='/dashboard/ll'
              header='Non-deterministic LL parsing'
              description='Lets you control the parsing actions (predict and match).'
            />
            <Card
              href='/dashboard/ll1'
              header='LL(1) parsing'
              description='LL parsing with one-symbol lookahead to make it deterministic.'
            />
            <Card
              href='/dashboard/lr'
              header='Non-deterministic LR parsing'
              description='Lets you control the parsing actions (shift and reduce).'
            />
            <Card
              href='/dashboard/lr0'
              header='LR(0) parsing'
              description='Deterministic LR parsing.'
            />
          </Card.Group>
        </div>
      </div>
    );
  }

}
