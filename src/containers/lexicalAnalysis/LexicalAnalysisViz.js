import React, { Component } from 'react';
import { Button, Header, Icon, Grid, Segment, Label } from 'semantic-ui-react';
import Window from 'components/Window/Window';
import VisualizationControl from 'components/VisualizationControl/VisualizationControl';
import VisualizationElement from 'components/VisualizationElement/VisualizationElement';
import TokensViz from 'components/TokensViz/TokensViz';
import ConsumableInput from 'components/ConsumableInput/ConsumableInput';
import Stack from 'components/Stack/Stack';
import _ from 'lodash';
import api from 'api';
import clone from 'clone';
import ui from 'utils/ui';
import automata from 'utils/automata';
import internal from './internal';
import RGL, { WidthProvider } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);

export default class LexicalAnalysisViz extends Component {

  state = {
    dfa: {
      instance: null,
      nodes: null,
      edges: null
    },

    tokens: {
      data: null,
      index: 0
    },

    stateStack: [],

    content: {
      data: null,
      index: -1
    },

    breakpoint: {
      data: null,
      index: -1
    },

    dashboardLayout: [
      {i: 'history', x: 0, y: 0, w: 5, h: 4, minH: 4},
      {i: 'input', x: 0, y: 1, w: 5, h: 3, minH: 3},
      {i: 'dfa', x: 0, y: 2, w: 4, h: 14, minH: 14},
      {i: 'stack', x: 4, y: 2, w: 1, h: 14},
      {i: 'tokens', x: 0, y: 3, w: 5, h: 3}
    ],

    ui: clone(ui.state)
  }

  componentDidMount() {
    api.lexicalAnalysis(this.props.data)
      .then(res => {
        this.setState({
          breakpoint: {
            data: res.data.breakpoints,
            index: -1
          },

          dfa: automata.visDataFormat('dfa-viz', res.data.dfa),

          content: {
            data: this.props.data.content,
            index: -1
          }
        }, this.initializers.setDfaData)
      })
      .catch(err => {
        console.log(err);
      });
  }

  initializers = {
    setDfaData: () => {
      automata.updateNodesAttr(this.state.dfa, this.state.dfa.nodes.map(n => {
        const accepted = n.data !== null
          ? n.data.map(tokenType => `<li>${tokenType.name}, ${tokenType.regex}, priority: ${tokenType.priority}</li>`)
          : null;

        return {
          id: n.id,
          title: accepted === null ? null :
            `Accepts:
            <ul>
              ${accepted}
            </ul>`
        }
      }));
    }
  }

  eventHandlers = {
    handleBackClick: () => {
      this.props.windowChangeHandler('input');
    }
  }

  renderers = {
    renderStack: state => {
      return <div key={state.id}>{state.id}</div>
    }
  }

  breakpoint = {
    visualizeForward: breakpoint => {
      const data = breakpoint.data;
      const index = this.state.breakpoint.index;
      internal.forward[_.camelCase(breakpoint.label)].call(this, { data, index });
    },

    visualizeBackward: breakpoint => {

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
        {ui.obj.modal.render(this)}

        <div className='dashboard-card-header'>
          <Header as='h1'>Lexical analysis</Header>
        </div>

        <div className='dashboard-card-content'>
          <ReactGridLayout
            className='layout'
            layout={this.state.dashboardLayout}
            cols={5}
            rowHeight={30}
            items={5}
            draggableHandle='.rgl-handle'>

            <div key='history'>
              <Window title='Actions history'>
                <VisualizationElement.ActionsHistory ref='actionsHistory'/>
              </Window>
            </div>

            <div key='input'>
              <Window title='Input'>
                <ConsumableInput content={this.state.content}/>
              </Window>
            </div>

            <div key='dfa'>
              <Window title='Deterministic finite automaton' titleColor='blue'>
                <div id='dfa-viz' style={{ height: 500 }}></div>
              </Window>
            </div>

            <div key='stack'>
              <Window title='Stack'>
                <Stack
                  stack={this.state.stateStack}
                  render={this.renderers.renderStack}/>
              </Window>
            </div>

            <div key='tokens'>
              <Window title='Tokens'>
                <TokensViz tokens={this.state.tokens} />
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
