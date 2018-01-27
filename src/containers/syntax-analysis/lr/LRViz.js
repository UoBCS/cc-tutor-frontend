import React, { Component } from 'react';
import { Button, Header, Icon, Grid, Segment, Label } from 'semantic-ui-react';
import Grammar from 'components/Grammar/Grammar';
import Stack from 'components/Stack/Stack';
import TokensViz from 'components/TokensViz/TokensViz';
import api from 'api';
import tree from 'utils/tree';
import ui from 'utils/ui';
import clone from 'clone';

export default class LRViz extends Component {

  state = {
    lrRunId: null,

    grammar: null,

    stack: null,

    tokens: null,

    parseTree: {
      instance: null,
      nodes: null,
      edges: null
    },

    chooseProduction: false,

    ui: clone(ui.state)
  }

  componentDidMount() {
    api.lr.initParser(this.props.data)
      .then(res => {
        this.initializers.initParser(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    api.lr.deleteRun(this.state.lrRunId);
  }

  initializers = {
    initParser: data => {
      this.setState({
        lrRunId: data.id,

        tokenTypes: data.token_types,

        grammar: data.grammar,

        stack: data.stack,

        tokens: data.input,

        parseTree: tree.visDataFormat('parse-tree-viz', data.parse_tree, 'node', false)
      });
    }
  }

  updaters = {
    updateRun: res => {
      const data = res.data;

      this.setState({
        tokens: data.input,
        stack: data.stack,
        parseTree: tree.visDataFormat('parse-tree-viz', data.parse_tree, 'node', false)
      });
    }
  }

  eventHandlers = {
    handleBackClick: () => {
      this.props.windowChangeHandler('input');
    },

    handleShiftClick: () => {
      api.lr.shift({ run_id: this.state.lrRunId })
        .then(this.updaters.updateRun)
        .catch(err => {
          ui.obj.message.show(this, 'negative', 'Error', ui.renderErrors(err));
        });
    },

    handleReduceClick: () => {
      this.setState({ chooseProduction: true });
      ui.obj.message.show(this, 'info', 'Reduce', 'Choose a production for the reduce step');
    },

    handleProductionClick: (lhs, rhs) => {
      return () => {
        if (!this.state.chooseProduction) {
          return;
        }

        api.lr.reduce({
          run_id: this.state.lrRunId,
          lhs,
          rhs
        })
        .then(res => {
          this.setState({ chooseProduction: false });
          ui.obj.message.hide(this);

          this.updaters.updateRun(res);
        })
        .catch(err => {
          ui.obj.message.show(this, 'negative', 'Error', ui.renderErrors(err));
        });
      }
    }
  }

  renderers = {
    renderStack: (s, idx) => {
      return <div key={idx}>{s}</div>;
    }
  }

  render() {
    return (
      <div className='dashboard-card'>
        <div className='dashboard-card-header'>
          <Grid className='viz-heading'>
            <Grid.Column floated='left' width={9} className='viz-heading-left '>
              <Header
                as='h1'
                className='light-heading'>
                Nondeterministic LR parsing
              </Header>
              <p>
                In this section you're going to use a non-deterministic LR parser
                where you will input each step to take.
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
          <Button.Group size='large'>
            <Button onClick={this.eventHandlers.handleShiftClick}>Shift</Button>
            <Button.Or />
            <Button onClick={this.eventHandlers.handleReduceClick}>Reduce</Button>
          </Button.Group>

          {ui.obj.message.render(this)}

          <TokensViz tokens={this.state.tokens} />

          <Grammar
            grammar={this.state.grammar}
            productionClickHandler={this.eventHandlers.handleProductionClick}/>

          <Grid>
            <Grid.Column width={12}>
              <Segment>
                <Label as='a' color='blue' ribbon>Parse tree</Label>
                <div id='parse-tree-viz' style={{ height: 500 }}></div>
              </Segment>
            </Grid.Column>
            <Grid.Column width={4}>
              <Stack
                stack={this.state.stack}
                render={this.renderers.renderStack}/>
            </Grid.Column>
          </Grid>
        </div>

        <div className='dashboard-card-footer'>
          <Button animated onClick={this.eventHandlers.handleBackClick}>
            <Button.Content visible>Back</Button.Content>
            <Button.Content hidden>
              <Icon name='left arrow' />
            </Button.Content>
          </Button>
          <br style={{ clear: 'both' }}/>
        </div>
      </div>
    );
  }

}
