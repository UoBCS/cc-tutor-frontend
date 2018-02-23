import React, { Component } from 'react';
import { Grid, Header, Button } from 'semantic-ui-react';

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
                Bla bla
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
          <p>Some cards here</p>
        </div>
      </div>
    );
  }

}
