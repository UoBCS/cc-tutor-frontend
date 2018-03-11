import React, { Component } from 'react';
import { Button, Header, Icon, Grid, Segment, Label } from 'semantic-ui-react';
import Window from 'components/Window/Window';
import Grammar from 'components/Grammar/Grammar';
import Stack from 'components/Stack/Stack';
import TokensViz from 'components/TokensViz/TokensViz';
import api from 'api';
import tree from 'utils/tree';
import ui from 'utils/ui';
import clone from 'clone';
import RGL, { WidthProvider } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);

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

    dashboardLayout: [
      {i: 'tokens', x: 0, y: 0, w: 2, h: 4, minH: 3},
      {i: 'grammar', x: 2, y: 0, w: 2, h: 4, minH: 4},
      {i: 'parseTree', x: 0, y: 1, w: 3, h: 14, minH: 14},
      {i: 'stack', x: 3, y: 1, w: 1, h: 14},
    ],

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

    handleProductionClick: (lhs, rhs) => () => {
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

  renderers = {
    renderStack: (s, idx) => <div key={idx}>{s}</div>
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
          <div style={{ margin: '30px auto', textAlign: 'center' }}>
            <Button.Group size='large'>
              <Button onClick={this.eventHandlers.handleShiftClick}>Shift</Button>
              <Button.Or />
              <Button onClick={this.eventHandlers.handleReduceClick}>Reduce</Button>
            </Button.Group>
          </div>

          {ui.obj.message.render(this)}

          <ReactGridLayout
            className='layout'
            layout={this.state.dashboardLayout}
            cols={4}
            rowHeight={30}
            items={4}
            draggableHandle='.rgl-handle'>

            <div key='tokens'>
              <Window title='Tokens'>
                <TokensViz tokens={this.state.tokens}/>
              </Window>
            </div>

            <div key='grammar'>
              <Window title='Grammar'>
                <Grammar
                  grammar={this.state.grammar}
                  productionClickHandler={this.eventHandlers.handleProductionClick}/>
              </Window>
            </div>

            <div key='parseTree'>
              <Window title='Parse tree' titleColor='blue'>
                <div id='parse-tree-viz' style={{ height: 500 }}></div>
              </Window>
            </div>

            <div key='stack'>
              <Window title='Stack'>
                <Stack
                  stack={this.state.stack}
                  render={this.renderers.renderStack}/>
              </Window>
            </div>

          </ReactGridLayout>
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
