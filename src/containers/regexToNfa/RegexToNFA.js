import React, { Component } from 'react';
import { Button, Input, Segment, Header, Grid, Label } from 'semantic-ui-react';
import VisualizationControl from 'components/VisualizationControl/VisualizationControl';
import VisualizationElement from 'components/VisualizationElement/VisualizationElement';
import Window from 'components/Window/Window';
import { breakpoint } from './breakpoint';
import globalBreakpointProcessor from 'utils/globalBreakpointProcessor';
import userInteraction from './userInteraction';
import api from 'api';
import misc from 'utils/misc';
import automata from 'utils/automata';
import tree from 'utils/tree';
import ui from 'utils/ui';
import clone from 'clone';
import shortid from 'shortid';

export default class RegexToNFA extends Component {
  state = {
    input: {
      regex: ''
    },

    regexTree: {
      instance: null,
      nodes: null,
      edges: null
    },

    nfa: {
      instance: null,
      nodes: null,
      edegs: null
    },

    breakpoint: {
      data: null,
      index: -1
    },

    ui: clone(ui.state)
  }

  eventHandlers = {
    inputChange: event => {
      const target = event.target;
      let input = this.state.input;
      input[target.name] = target.value;
      this.setState({ input });
    },

    regexToNfaClick: () => {
      const nfaOptions = {
        manipulation: {
          enabled: true,
          initiallyActive: true,
          addNode: userInteraction.nfa.addNode.bind(this),
          addEdge: userInteraction.nfa.addEdge.bind(this)
        }
      };

      ui.obj.loader.show(this);

      api.regexToNfa(this.state.input.regex)
        .then(res => {
          ui.obj.loader.hide(this);

          this.setState({
            breakpoint: {
              data: res.data.breakpoints,
              index: -1
            },
            nfa: automata.createEmpty('nfa-viz', nfaOptions),
            regexTree: tree.visDataFormat('regex-tree-viz', res.data.regex_tree)
          });
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
        });
    }
  }

  componentWillMount() {
    globalBreakpointProcessor.initialize(breakpoint);
  }

  render() {
    return (
      <div className='dashboard-card'>
        {ui.obj.modal.render(this)}

        {ui.obj.loader.render(this)}

        {ui.obj.toast.render(this)}

        <div className='dashboard-card-header'>
          <Grid className='viz-heading'>
            <Grid.Column floated='left' width={9} className='viz-heading-left'>
              <Header
                as='h1'
                className='light-heading'>
                Regular expression to NFA
              </Header>
              <p>
                Enter the regular expression in the field below.
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

          <Input
            name='regex'
            value={this.state.input.regex}
            onChange={this.eventHandlers.inputChange}
            placeholder='Regular expression'
            style={{ margin: '0px auto 30px auto' }}
            action={<Button primary onClick={this.eventHandlers.regexToNfaClick}>Run</Button>}/>

          <VisualizationElement.ActionsHistory ref='actionsHistory'/>

          <Grid columns={2}>
            <Grid.Column>
              <Window title='Regular expression parse tree' titleColor='blue'>
                <div id='regex-tree-viz' style={{ height: 600 }}></div>
              </Window>
            </Grid.Column>
            <Grid.Column>
              <Window title='Regular expression parse tree' titleColor='blue'>
                <div id='nfa-viz' style={{ height: 600 }}></div>
              </Window>
            </Grid.Column>
          </Grid>

          <VisualizationControl
            ref='visualizationControl'
            active={this.state.regexTree.instance !== null}
            breakpoint={this.state.breakpoint}
            visualizeBreakpointForward={globalBreakpointProcessor.eventHandlers.visualizeForward().bind(this)}
            visualizeBreakpointBackward={globalBreakpointProcessor.eventHandlers.visualizeBackward().bind(this)}
            saveVisualizationHandler={globalBreakpointProcessor.eventHandlers.saveVisualization().bind(this)}
            checkAnswerHandler={userInteraction.checkAnswer.bind(this)}
            updateState={misc.updateState.bind(this)}/>
        </div>
      </div>
    )
  }
}
