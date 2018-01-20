import React, { Component } from 'react';
import { Button, Header, Icon, Grid, Segment, Label } from 'semantic-ui-react';
import VisualizationControl from 'components/VisualizationControl';
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
          <VisualizationElement.ActionsHistory ref='actionsHistory'/>

          <ConsumableInput
            content={this.state.content}
            title='Input'
            titleColor='red'/>

          <Grid>
            <Grid.Column width={12}>
              <Segment>
                <Label as='a' color='blue' ribbon>Deterministic finite automaton</Label>
                <div id='dfa-viz' style={{ height: 500 }}></div>
              </Segment>
            </Grid.Column>
            <Grid.Column width={4}>
              <Stack
                stack={this.state.stateStack}
                render={this.renderers.renderStack}/>
            </Grid.Column>
          </Grid>

          <TokensViz tokens={this.state.tokens} />

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
