import React, { Component } from 'react';
import { Button, Container, Input, Segment, Header, Grid } from 'semantic-ui-react';
import VisualizationControl from 'components/VisualizationControl';
import VisualizationElement from 'components/VisualizationElement/VisualizationElement';
import api from 'api';
import misc from 'utils/misc';
import automata from 'utils/automata';
import tree from 'utils/tree';

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
      scopeStack: [],
      indexStack: [0],
    },

    vizElements: {
      actionsHistory: [],
      actionsHistoryIndex: 0
    },

    ui: this.props.uiState
  }

  /*componentWillMount() {

  }

  init = {
    actionsHistory
  }*/

  breakpoint = {
    visualizeForward: (breakpoint, index) => {
      let data = breakpoint.data;

      switch (breakpoint.label) {
        case 'e':
        case 'c':
        case 's':
          automata.addEdge(this.state.nfa, data.entry, data.exit, data.transition);

          VisualizationElement.ActionsHistory.addOrSelect(this, index, {
            title: `Add ${this.breakpoint.map[breakpoint.label]} transition from state ${data.entry.id} to state ${data.exit.id}`,
          });
          break;
        case 'rep':
          automata.addEdge(this.state.nfa, data.state1, data.state2, automata.EPSILON);
          automata.addEdge(this.state.nfa, data.state2, data.state1, automata.EPSILON);

          VisualizationElement.ActionsHistory.addOrSelect(this, index, {
            title: `Add ${this.breakpoint.map[breakpoint.label]} transitions between states ${data.state1} and ${data.state2} to form repetition`,
          });
          break;
        case 'or1':
          automata.addNode(this.state.nfa, data.entry);

          VisualizationElement.ActionsHistory.addOrSelect(this, index, {
            title: `Add entry choice state ${data.entry.id}`,
          });
          break;
        case 'or2':
          automata.addEdge(this.state.nfa, data.entry, data.choices[0], automata.EPSILON);
          automata.addEdge(this.state.nfa, data.entry, data.choices[1], automata.EPSILON);

          VisualizationElement.ActionsHistory.addOrSelect(this, index, {
            title: `Add ${automata.EPSILON}-transitions to choice states ${data.choices[0].id} and ${data.choices[1].id} from entry state ${data.entry.id}`,
          });
          break;

        case 'or3':
          automata.addNode(this.state.nfa, data.exit);

          VisualizationElement.ActionsHistory.addOrSelect(this, index, {
            title: `Add exit choice state ${data.exit.id}`,
          });
          break;

        case 'or4':
          automata.addEdge(this.state.nfa, data.choices[0], data.exit, automata.EPSILON);
          automata.addEdge(this.state.nfa, data.choices[1], data.exit, automata.EPSILON);

          VisualizationElement.ActionsHistory.addOrSelect(this, index, {
            title: `Add ${automata.EPSILON}-transitions from choice states ${data.choices[0].id} and ${data.choices[1].id} to exit state ${data.exit.id}`,
          });
          break;
        default:
          // TODO: show error
          break;
      }
    },

    visualizeBackward: (breakpoint, index) => {
      let data = breakpoint.data;

      switch (breakpoint.label) {
        case 'e':
        case 'c':
        case 's':
          automata.removeEdge(this.state.nfa, data.entry, data.exit, data.transition);
          break;
        case 'rep':
          automata.removeEdge(this.state.nfa, data.state1, data.state2, automata.EPSILON);
          automata.removeEdge(this.state.nfa, data.state2, data.state1, automata.EPSILON);
          break;
        case 'or1':
          automata.removeNode(this.state.nfa, data.entry);
          break;
        case 'or2':
          automata.removeEdge(this.state.nfa, data.entry, data.choices[0], automata.EPSILON);
          automata.removeEdge(this.state.nfa, data.entry, data.choices[1], automata.EPSILON);
          break;
        case 'or3':
          automata.removeNode(this.state.nfa, data.exit);
          break;
        case 'or4':
          automata.removeEdge(this.state.nfa, data.choices[0], data.exit, automata.EPSILON);
          automata.removeEdge(this.state.nfa, data.choices[1], data.exit, automata.EPSILON);
          break;
        default:

          break;
      }

      VisualizationElement.ActionsHistory.addOrSelect(this, index);
    },

    map: {
      e: automata.EPSILON,
      c: 'character',
      s: 'sequence (through epsilon)',
      rep: 'repetition (through epsilon)',
      or1: ''
    }
  }

  eventHandlers = {
    handleInputChange: event => {
      const target = event.target;
      let input = this.state.input;
      input[target.name] = target.value;
      this.setState({ input });
    },

    handleRegexToNfa: () => {
      this.props.ui.loader.show(this, 'main');

      api.regexToNfa(this.state.input.regex)
        .then(res => {
          this.props.ui.loader.hide(this, 'main');

          console.log(res.data);

          this.setState({
            breakpoint: {
              data: res.data.breakpoints,
              scopeStack: [],
              indexStack: [0],
            },
            nfa: automata.createEmpty('nfa-viz'),
            regexTree: tree.visDataFormat('regex-tree-viz', res.data.regex_tree)
          });
        })
        .catch(err => {
          this.props.ui.loader.hide(this, 'main');
          console.log(err);
        });
    }
  }

  helpers = {
    updateState: obj => {
      this.setState(obj);
    }
  }

  render() {
    return (
      <div>
        {this.props.ui.modal.render(this)}

        {this.props.ui.message.render(this)}

        {this.props.ui.loader.render(this, 'main')}

        <Container className='dashboard-content'>
          <Grid>
            <Grid.Column floated='left' width={9}>
              <Header
                as='h1'
                className='light-heading'>
                Regular expression to NFA
              </Header>
              <p>
                Some nice description right here please.
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

          <Input
            name='regex'
            value={this.state.input.regex}
            onChange={this.eventHandlers.handleInputChange}
            placeholder='Regular expression'
            style={{ margin: '30px auto' }}
            action={<Button onClick={this.eventHandlers.handleRegexToNfa}>Run</Button>}/>

          <VisualizationElement.ActionsHistory
            actions={this.state.vizElements.actionsHistory}
            index={this.state.vizElements.actionsHistoryIndex}
            updateState={this.helpers.updateState}/>

          <Grid columns={2}>
            <Grid.Column>
              <Segment className='viz-area'>
                <Header as='h3' className='viz-area-title' content='Regular expression parse tree'/>
                <div id='regex-tree-viz' style={{ height: 600 }}></div>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment className='viz-area'>
                <Header as='h3' className='viz-area-title' content='Non-deterministic finite automaton'/>
                <div id='nfa-viz' style={{ height: 600 }}></div>
              </Segment>
            </Grid.Column>
          </Grid>

          <VisualizationControl
            active={this.state.regexTree.instance !== null}
            breakpoint={this.state.breakpoint}
            visualizeBreakpointForward={this.breakpoint.visualizeForward}
            visualizeBreakpointBackward={this.breakpoint.visualizeBackward}
            updateState={this.helpers.updateState}/>
        </Container>
      </div>
    )
  }
}
