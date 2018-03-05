import React, { Component } from 'react';
import { Button, Grid, Header, Icon } from 'semantic-ui-react';
import Window from 'components/Window/Window';
import tree from 'utils/tree';
import ui from 'utils/ui';
import clone from 'clone';

export default class TypeChecking extends Component {

  state = {
    ast: null,
    ui: clone(ui.state)
  }

  initializers = {
    buildAstTree: () => {
      this.setState({
        ast: tree.fromAst('ast-viz', this.props.data)
      }, this.initializers.setNodeClickHandler);
    },

    setNodeClickHandler: () => {
      tree.visUtils.setDataOnHover(this.state.ast);
    }
  }

  eventHandlers = {
    nextClick: () => {

    },

    backClick: () => {
      this.props.windowChangeHandler('input', {
        'nextWindow': 'typeChecking'
      });
    }
  }

  componentDidMount() {
    this.initializers.buildAstTree();
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
                Type checking
              </Header>
              <p>
                Type check the AST of the program.
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

          <Grid columns={2}>
            <Grid.Column>
              <Window title='AST' titleColor='blue'>
                <div id='ast-viz' style={{ height: 500 }}></div>
              </Window>
            </Grid.Column>

            <Grid.Column>
              <p>Type checking</p>
            </Grid.Column>
          </Grid>
        </div>

        <div className='dashboard-card-footer'>
          <Button animated onClick={this.eventHandlers.backClick}>
            <Button.Content visible>Back</Button.Content>
            <Button.Content hidden>
              <Icon name='left arrow' />
            </Button.Content>
          </Button>

          <Button animated primary floated='right' onClick={this.eventHandlers.nextClick}>
            <Button.Content visible>Next</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>
          <br style={{ clear: 'both' }}/>
        </div>
      </div>
    );
  }

}
