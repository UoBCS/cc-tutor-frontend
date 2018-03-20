import React, { Component } from 'react';
import { Button, Header, Icon, Grid, Segment, Label, Message } from 'semantic-ui-react';
import Window from 'components/Window/Window';
import Grammar from 'components/Grammar/Grammar';
import Stack from 'components/Stack/Stack';
import TokensViz from 'components/TokensViz/TokensViz';
import VisualizationControl from 'components/VisualizationControl/VisualizationControl';
import VisualizationElement from 'components/VisualizationElement/VisualizationElement';
import api from 'api';
import tree from 'utils/tree';
import ui from 'utils/ui';
import misc from 'utils/misc';
import { breakpoint } from './breakpoint';
import globalBreakpointProcessor from 'utils/globalBreakpointProcessor';
import clone from 'clone';
import _ from 'lodash';
import RGL, { WidthProvider } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);

export default class LL1Viz extends Component {

  state = {
    grammar: null,

    stack: null,

    tokens: null,

    parseTree: {
      instance: null,
      nodes: null,
      edges: null
    },

    ff: null,

    breakpoint: {
      data: null,
      index: -1
    },

    dashboardLayout: [
      {i: 'history', x: 0, y: 0, w: 6, h: 4, minH: 4},
      {i: 'tokens', x: 0, y: 1, w: 2, h: 4, minH: 3},
      {i: 'grammar', x: 2, y: 1, w: 2, h: 4, minH: 4},
      {i: 'ff', x: 4, y: 1, w: 2, h: 4, minH: 4},
      {i: 'parseTree', x: 0, y: 2, w: 5, h: 14, minH: 14},
      {i: 'stack', x: 5, y: 2, w: 1, h: 14}
    ],

    ui: clone(ui.state)
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
        grammar: this.props.data.grammar
      });
    }
  }

  eventHandlers = {
    backClick: () => {
      this.props.windowChangeHandler('input');
    }
  }

  renderers = {
    renderStack: (s, idx) => <div key={idx}>{s}</div>,

    renderFirstOrFollow: () => {
      if (this.state.ff === null) {
        return null;
      }

      const style = {
        fontFamily: 'monospace',
        fontWeight: 900
      };

      return (
        <div>
          <p style={style}>
            {this.state.ff.type}({this.state.ff.argument.join(' ')}) = {`{${this.state.ff.result.join(', ')}}`}
          </p>
        </div>
      );
    }
  }

  componentWillMount() {
    globalBreakpointProcessor.initialize(breakpoint);
  }

  componentDidMount() {
    ui.obj.loader.show(this);

    api.ll1.parse(this.props.data)
      .then(res => {
        ui.obj.loader.hide(this);
        this.initializers.setData(res.data);
      })
      .catch(err => {
        ui.obj.loader.hide(this);
        ui.obj.message.showErrorFromData(this, err);
      });
  }

  render() {
    return (
      <div className='dashboard-card'>
        {ui.obj.toast.render(this)}

        <div className='dashboard-card-header'>
          <Grid className='viz-heading'>
            <Grid.Column floated='left' width={9} className='viz-heading-left '>
              <Header
                as='h1'
                className='light-heading'>
                LL(1) parsing
              </Header>
              <p>
                In this section you're going to use the LL(1) parser.
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

          <ReactGridLayout
            className='layout'
            layout={this.state.dashboardLayout}
            cols={6}
            rowHeight={30}
            items={6}
            draggableHandle='.rgl-handle'>

            <div key='history'>
              <Window title='Actions history'>
                <VisualizationElement.ActionsHistory ref='actionsHistory'/>
              </Window>
            </div>

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

            <div key='ff'>
              <Window title='First &amp; Follow'>
                {this.renderers.renderFirstOrFollow()}
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
            visualizeBreakpointForward={globalBreakpointProcessor.eventHandlers.visualizeForward().bind(this)}
            visualizeBreakpointBackward={globalBreakpointProcessor.eventHandlers.visualizeBackward().bind(this)}
            saveVisualizationHandler={globalBreakpointProcessor.eventHandlers.saveVisualization().bind(this)}
            updateState={misc.updateState.bind(this)}/>

        </div>

        <div className='dashboard-card-footer'>
          <Button animated onClick={this.eventHandlers.backClick}>
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
