import React, { Component } from 'react';
import { Button, Header, Icon, Grid, Segment, Label, Message } from 'semantic-ui-react';
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
      console.log(data);
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
      return <div key={idx}>{s}</div>;
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

          <TokensViz tokens={this.state.tokens}/>

          <Grammar grammar={this.state.grammar}/>

          <Segment>
            <Label as='a' attached='top left' color='teal'>Dotted items DFA</Label>
            <div id='dfa-viz' style={{ height: 500 }}></div>
          </Segment>

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
