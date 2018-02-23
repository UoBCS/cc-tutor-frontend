import React, { Component } from 'react';
import { Button, Header, Icon, Grid, Segment, Label, Message } from 'semantic-ui-react';
import Window from 'components/Window/Window';
import Grammar from 'components/Grammar/Grammar';
import Stack from 'components/Stack/Stack';
import TokensViz from 'components/TokensViz/TokensViz';
import VisualizationControl from 'components/VisualizationControl/VisualizationControl';
import api from 'api';
import automata from 'utils/automata';
import tree from 'utils/tree';
import ui from 'utils/ui';
import internal from './internal';
import clone from 'clone';
import _ from 'lodash';
import RGL, { WidthProvider } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);

export default class LR0Viz extends Component {

  state = {
    grammar: null,

    stack: null,

    tokens: null,

    parseTree: {
      instance: null,
      nodes: null,
      edges: null
    },

    itemsDfa: {
      instance: null,
      nodes: null,
      edges: null
    },

    breakpoint: {
      data: null,
      index: -1
    },

    dashboardLayout: [
      {i: 'tokens', x: 0, y: 0, w: 3, h: 4, minH: 3},
      {i: 'grammar', x: 3, y: 0, w: 2, h: 4, minH: 4},
      {i: 'dfa', x: 0, y: 1, w: 4, h: 14, minH: 14},
      {i: 'stack', x: 4, y: 1, w: 1, h: 14},
      {i: 'parseTree', x: 0, y: 2, w: 5, h: 14, minH: 14},
    ],

    ui: clone(ui.state)
  }

  componentDidMount() {
    ui.obj.loader.show(this);

    api.lr0.parse(this.props.data)
      .then(res => {
        this.initializers.setData(res.data);
        ui.obj.loader.hide(this);
      })
      .catch(err => {
        ui.obj.message.show(this, 'negative', 'Error', ui.renderErrors(err));
        ui.obj.loader.hide(this);
      });
  }

  initializers = {
    setData: data => {
      this.setState({
        breakpoint: {
          data: data.breakpoints,
          index: -1
        },
        tokens: {
          data: data.tokens,
          index: 0
        },
        grammar: this.props.data.grammar,
        itemsDfa: automata.visDataFormat('dfa-viz', data.items_dfa.transitions)
      }, () => {
        automata.setNodeData(this.state.itemsDfa, data.items_dfa.states, data => {
          return data.data.reduce((acc, item) => {
            let rhs = _.cloneDeep(item.rhs);
            rhs.splice(item.dot_index, 0, '•');
            return acc + item.lhs + ' => ' + rhs.join(' ') + '\n';
          }, '');
        });
      });
    }
  }

  eventHandlers = {
    handleBackClick: () => {
      this.props.windowChangeHandler('input');
    }
  }

  renderers = {
    renderStack: (s, idx) => {
      return <div key={idx}>{s.id}</div>;
    }
  }

  breakpoint = {
    visualizeForward: breakpoint => {
      const data = breakpoint.data;
      const index = this.state.breakpoint.index;
      internal.forward[_.camelCase(breakpoint.label)].call(this, { data, index });
    },

    visualizeBackward: breakpoint => {
      const data = breakpoint.data;
      const index = this.state.breakpoint.index;
      internal.backward[_.camelCase(breakpoint.label)].call(this, { data, index });
    }
  }

  userInteraction = {
    handleCheckAnswerClick: () => {

    }
  }

  helpers = {
    updateState: (obj, cb) => {
      this.setState(obj, cb);
    }
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
                LR(0) parsing
              </Header>
              <p>
                In this section you're going to use the LR(0) parser.
              </p>
            </Grid.Column>
            <Grid.Column floated='right' width={1}>
              <Button.Group basic size='small' style={{ float: 'right' }}>
                <Button icon='settings' />
                <Button icon='question' />
              </Button.Group>
              <br style={{ clear: 'both' }}/>
            </Grid.Column>
          </Grid>
        </div>

        <div className='dashboard-card-content'>
          {ui.obj.message.render(this)}

          <ReactGridLayout
            className='layout'
            layout={this.state.dashboardLayout}
            cols={5}
            rowHeight={30}
            items={5}
            draggableHandle='.rgl-handle'>

            <div key='tokens'>
              <Window title='Tokens'>
                <TokensViz tokens={this.state.tokens}/>
              </Window>
            </div>

            <div key='grammar'>
              <Window title='Grammar'>
                <Grammar grammar={this.state.grammar}/>
              </Window>
            </div>

            <div key='dfa'>
              <Window title='Dotted items DFA'>
                <div id='dfa-viz' style={{ height: 500 }}></div>
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

          <VisualizationControl
            active
            breakpoint={this.state.breakpoint}
            visualizeBreakpointForward={this.breakpoint.visualizeForward}
            visualizeBreakpointBackward={this.breakpoint.visualizeBackward}
            checkAnswerHandler={this.userInteraction.handleCheckAnswerClick}
            updateState={this.helpers.updateState}/>

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
