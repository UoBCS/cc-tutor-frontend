import React, { Component } from 'react';
import { Form, Icon, Input, Segment, Header, Menu, Grid } from 'semantic-ui-react';
import VisualizationControl from 'components/VisualizationControl';
import vis from 'vis';
import objectPath from 'object-path';
import api from 'api';
import misc from 'utils/misc';
import automata from 'utils/automata';
import tree from 'utils/tree';

class RegexToNFA extends Component {
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
      actionsHistory: []
    },

    ui: misc.lazyClone(this.props.uiState)
  }

  breakpoint = {
    visualize: breakpoint => {
      let data = breakpoint.data;

      switch (breakpoint.label) {
        case 'e':
        case 'c':
        case 's':
          automata.addEdge(this.state.nfa, data.entry, data.exit, data.transition);
          break;
        case 'rep':
          automata.addEdge(this.state.nfa, data.state1, data.state2, automata.EPSILON);
          automata.addEdge(this.state.nfa, data.state2, data.state1, automata.EPSILON);
          break;
        case 'or1':
          automata.addNode(this.state.nfa, data.entry);
          break;
        case 'or2':
          automata.addEdge(this.state.nfa, data.entry, data.choices[0], automata.EPSILON);
          automata.addEdge(this.state.nfa, data.entry, data.choices[1], automata.EPSILON);
          break;

        case 'or3':
          automata.addNode(this.state.nfa, data.exit);
          break;

        case 'or4':
          automata.addEdge(this.state.nfa, data.choices[0], data.exit, automata.EPSILON);
          automata.addEdge(this.state.nfa, data.choices[1], data.exit, automata.EPSILON);
          break;
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
        {this.props.ui.message.render(this)}

        <Form size='massive'>
          <Form.Group>
            <Input
              name='regex'
              value={this.state.input.regex}
              onChange={this.eventHandlers.handleInputChange}
              placeholder='Regular expression'
              icon={<Icon name='search' inverted circular link onClick={this.eventHandlers.handleRegexToNfa} />} />
          </Form.Group>
        </Form>

        {this.props.ui.loader.render(this, 'main')}

        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header as='h2' textAlign='center'>
                Regular expression parse tree
              </Header>
              <div id='regex-tree-viz' style={{ width: 600, height: 600 }}></div>
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as='h2' textAlign='center'>Non-deterministic finite automaton</Header>
              <div id='nfa-viz' style={{ width: 600, height: 600 }}></div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <VisualizationControl
          active={this.state.regexTree.instance !== null}
          breakpoint={this.state.breakpoint}
          visualizeBreakpoint={this.breakpoint.visualize}
          updateState={this.helpers.updateState}/>
      </div>
    )
  }
}

export default RegexToNFA;
