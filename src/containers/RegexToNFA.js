import React, { Component } from 'react';
import { Button, Input, Segment, Header, Grid } from 'semantic-ui-react';
import VisualizationControl from 'components/VisualizationControl';
import VisualizationElement from 'components/VisualizationElement/VisualizationElement';
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
      scopeStack: [],
      indexStack: [0],
    },

    ui: clone(ui.state)
  }

  breakpoint = {
    visualizeForward: (breakpoint, index) => {
      let data = breakpoint.data;

      switch (breakpoint.label) {
        case 'e':
        case 'c':
        case 's':
          automata.addEdge(this.state.nfa, data.entry, data.exit, data.transition);

          this.refs.actionsHistory.addOrSelect(index, {
            title: `Add ${this.breakpoint.map[breakpoint.label]} transition from state ${data.entry.id} to state ${data.exit.id}`,
            breakpoint: data
          });
          break;
        case 'rep':
          automata.addEdge(this.state.nfa, data.state1, data.state2, automata.EPSILON);
          automata.addEdge(this.state.nfa, data.state2, data.state1, automata.EPSILON);

          this.refs.actionsHistory.addOrSelect(index, {
            title: `Add ${this.breakpoint.map[breakpoint.label]} transitions between states ${data.state1} and ${data.state2} to form repetition`,
            breakpoint: data
          });
          break;
        case 'or1':
          automata.addNode(this.state.nfa, data.entry);

          this.refs.actionsHistory.addOrSelect(index, {
            title: `Add entry choice state ${data.entry.id}`,
            breakpoint: data
          });
          break;
        case 'or2':
          automata.addEdge(this.state.nfa, data.entry, data.choices[0], automata.EPSILON);
          automata.addEdge(this.state.nfa, data.entry, data.choices[1], automata.EPSILON);

          this.refs.actionsHistory.addOrSelect(index, {
            title: `Add ${automata.EPSILON}-transitions to choice states ${data.choices[0].id} and ${data.choices[1].id} from entry state ${data.entry.id}`,
            breakpoint: data
          });
          break;

        case 'or3':
          automata.addNode(this.state.nfa, data.exit);

          this.refs.actionsHistory.addOrSelect(index, {
            title: `Add exit choice state ${data.exit.id}`,
            breakpoint: data
          });
          break;

        case 'or4':
          automata.addEdge(this.state.nfa, data.choices[0], data.exit, automata.EPSILON);
          automata.addEdge(this.state.nfa, data.choices[1], data.exit, automata.EPSILON);

          this.refs.actionsHistory.addOrSelect(index, {
            title: `Add ${automata.EPSILON}-transitions from choice states ${data.choices[0].id} and ${data.choices[1].id} to exit state ${data.exit.id}`,
            breakpoint: data
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

      this.refs.actionsHistory.addOrSelect(index);
    },

    map: {
      e: automata.EPSILON,
      c: 'character',
      s: 'sequence (through epsilon)',
      rep: 'repetition (through epsilon)',
      or1: ''
    }
  }

  userInteraction = {
    nodes: [],

    edges: [],

    addNode: (data, cb) => {
      data.id = shortid.generate();
      data.label = '';
      this.userInteraction.nodes.push(data.id);
      cb(data);
    },

    addEdge: (data, cb) => {
      data.arrows = 'to';
      data.label = prompt('Please enter the transition character:', 'ε');
      data.font = {align: 'top'};

      this.userInteraction.edges.push({
        from: data.from,
        to: data.to,
        label: data.label,
        new: !automata.isConnected(this.state.nfa, data.from)
          && !automata.isConnected(this.state.nfa, data.to)
      });

      if (data.from === data.to) {
        if (window.confirm('Do you want to connect the state to itself?')) {
          cb(data);
        }
      }
      else {
        cb(data);
      }
    },

    handleCheckAnswerClick: () => {
      const index = misc.last(this.state.breakpoint.indexStack);
      const breakpoint = this.state.breakpoint.data[index];
      const edges = this.userInteraction.edges;
      //const nodes = this.userInteraction.nodes;
      let valid;

      console.log(breakpoint);

      if (breakpoint.label === 's') {
        valid = edges[0].from === breakpoint.data.entry.id
            && edges[0].to === breakpoint.data.exit.id
            && edges[0].label === breakpoint.data.transition;
      } else if (breakpoint.label === 'c' || breakpoint.label === 'e') {
        valid = edges[0].label === breakpoint.data.transition
            && edges[0].new;
      }

      if (valid) {

      }
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
      const nfaOptions = {
        manipulation: {
          enabled: true,
          initiallyActive: true,
          addNode: this.userInteraction.addNode,
          addEdge: this.userInteraction.addEdge
        }
      };

      ui.obj.loader.show(this, 'main');

      api.regexToNfa(this.state.input.regex)
        .then(res => {
          ui.obj.loader.hide(this, 'main');

          console.log(res.data);

          this.setState({
            breakpoint: {
              data: res.data.breakpoints,
              scopeStack: [],
              indexStack: [0],
            },
            nfa: automata.createEmpty('nfa-viz', nfaOptions),
            regexTree: tree.visDataFormat('regex-tree-viz', res.data.regex_tree)
          });
        })
        .catch(err => {
          ui.obj.loader.hide(this, 'main');
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
        {ui.obj.modal.render(this)}

        {ui.obj.message.render(this)}

        {ui.obj.loader.render(this, 'main')}

        <div className='dashboard-card'>
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
            <Input
              name='regex'
              value={this.state.input.regex}
              onChange={this.eventHandlers.handleInputChange}
              placeholder='Regular expression'
              style={{ margin: '0px auto 30px auto' }}
              action={<Button primary onClick={this.eventHandlers.handleRegexToNfa}>Run</Button>}/>

            <VisualizationElement.ActionsHistory ref='actionsHistory'/>

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
              checkAnswerHandler={this.userInteraction.handleCheckAnswerClick}
              updateState={this.helpers.updateState}/>
          </div>
        </div>
      </div>
    )
  }
}
