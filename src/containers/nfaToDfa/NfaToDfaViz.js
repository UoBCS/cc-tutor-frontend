import React, { Component } from 'react';
import { Button, Container, Header, Grid, Segment, Menu } from 'semantic-ui-react';
import api from 'api';

class NfaToDfaViz extends Component {

  componentWillMount() {
    api.nfaToDfa(this.props.data)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <Container className='dashboard-content'>
          <Grid>
            <Grid.Column floated='left' width={9}>
              <Header
                as='h1'
                className='light-heading'>
                NFA to DFA visualization
              </Header>
              <p>
                Some nice description right here please.
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
        </Container>

        <Segment inverted style={{ position: 'fixed', right: 0, left: 250, bottom: 0, borderRadius: 0 }}>
          <Menu inverted secondary size='massive'>
            <Menu.Menu style={{ margin: '0 auto' }}>
              <Menu.Item>
                <Button labelPosition='left' icon='left chevron' content='Go back'/>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Segment>
      </div>
    );
  }

}

export default NfaToDfaViz;
