import React, { Component } from 'react';
import { Button, Card, Grid, Header } from 'semantic-ui-react';
import ui from 'utils/ui';
import clone from 'clone';

export default class DfaOperations extends Component {

  state = {
    ui: clone(ui.state)
  }

  render() {
    return (
      <div className='dashboard-card'>
        {ui.obj.loader.render(this)}

        <div className='dashboard-card-header'>
          <Grid className='viz-heading'>
            <Grid.Column floated='left' width={9} className='viz-heading-left '>
              <Header
                as='h1'
                className='light-heading'>
                Deterministic Finite Automaton Operations
              </Header>
              <p>
                Perform the DFA operations.
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
          {ui.obj.message.render(this)}

          <Card.Group>
            <Card
              href='/dashboard/dfa-operations/membership'
              header='Test for membership'
              description='Test if a word is accepted by the DFA.'
            />
          </Card.Group>
        </div>
      </div>
    );
  }

}
