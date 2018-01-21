import React, { Component } from 'react';
import { Button, Header, Icon, Grid, Segment, Label, Message } from 'semantic-ui-react';
import Grammar from 'components/Grammar/Grammar';
import Stack from 'components/Stack/Stack';
import TokensViz from 'components/TokensViz/TokensViz';
import VisualizationControl from 'components/VisualizationControl/VisualizationControl';
import api from 'api';
import tree from 'utils/tree';
import ui from 'utils/ui';
import internal from './internal';
import clone from 'clone';
import _ from 'lodash';

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

    first: null,

    follow: null,

    breakpoint: {
      data: null,
      index: -1
    },

    ui: clone(ui.state)
  }

  componentDidMount() {
    ui.obj.loader.show(this);

    api.ll1.parse(this.props.data)
      .then(res => {
        this.initializers.setData(res.data);
        ui.obj.loader.hide(this);
      })
      .catch(err => {
        console.log(err);
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
        grammar: this.props.data.grammar
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
    },

    renderFirst: () => {
      if (this.state.first === null) {
        return null;
      }

      const style = {
        fontFamily: 'monospace',
        fontWeight: 900
      };

      const localFirst = this.state.first.localExecution
            ? <ul style={style}>
                {this.state.first.localExecution.map((obj, idx) =>
                  <li key={idx}>FIRST({obj.argument}) = {`{${obj.result.join(', ')}}`}</li>
                )}
              </ul>
            : null;

      return (
        <div>
          {this.state.first.message
            ? <Message info><Message.Header>{this.state.first.message}</Message.Header></Message>
            : null
          }
          <p style={style}>FIRST({this.state.first.argument.join('')}) = {`{${this.state.first.result.join(', ')}}`}</p>
          {localFirst}
        </div>
      );
    },

    renderFollow: () => {
      return null;
      /*return this.state.follow === null ? null : (

      );*/
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

          <TokensViz tokens={this.state.tokens}/>

          <Grid>
            <Grid.Column width={8}>
              <Grammar grammar={this.state.grammar}/>
            </Grid.Column>
            <Grid.Column width={8}>
              <Segment padded>
                <Label as='a' color='blue' attached='top right'>First &amp; Follow</Label>
                {this.renderers.renderFirst()}
                {this.renderers.renderFollow()}
              </Segment>
            </Grid.Column>
          </Grid>

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
