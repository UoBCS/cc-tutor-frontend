import React, { Component } from 'react';
import { Form, Icon, Input, Segment, Header, Menu, Grid } from 'semantic-ui-react';
import ParseTreeViz from 'components/ParseTreeViz';
import VisualizationControl from 'components/VisualizationControl';
import vis from 'vis';
import objectPath from 'object-path';
import api from 'api';
import misc from 'utils/misc';
import automata from 'utils/automata';

class RegexToNFA extends Component {
  state = {
    input: {
      regex: ''
    },

    regexTreeData: null,

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

  init = {
    createAutomaton: (data, options) => {
      return new vis.Network(document.getElementById('nfa-viz'), data, options);
    }
  }

  breakpoint = {
    visualize: breakpoint => {
      let data = breakpoint.data;

      switch (breakpoint.label) {
        case 'e':
        case 'c':
        case 's':
          automata.addEdge(this.state.nfa, data.entry.id, data.exit.id, data.transition);
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

          let data = {
            nodes: new vis.DataSet(),
            edges: new vis.DataSet()
          };

          this.setState({
            breakpoint: {
              data: res.data.breakpoints,
              scopeStack: [],
              indexStack: [0],
            },
            regexTreeData: res.data.regex_tree,
          }, () => {
            this.setState({
              nfa: {
                instance: this.init.createAutomaton(data, {}),
                nodes: data.nodes,
                edges: data.edges
              }
            });
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
    const body = this.state.regexTreeData ?
    (
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as='h2' textAlign='center'>Regular expression parse tree</Header>
            <ParseTreeViz data={{
              treeData: this.state.regexTreeData
            }} />
          </Grid.Column>
          <Grid.Column width={8}>
            <Header as='h2' textAlign='center'>Non-deterministic finite automaton</Header>
            <div id='nfa-viz' style={{ width: 600, height: 600 }}></div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
    :
    (
      // Fix this
      <Header as='h2' icon textAlign='center'>
        <Icon name='users' circular />
        <Header.Content>
          Input a regular expression to visualize the conversion to NFA
        </Header.Content>
      </Header>
    )

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
        {body}

        <VisualizationControl
          active={this.state.regexTreeData}
          breakpoint={this.state.breakpoint}
          visualizeBreakpoint={this.breakpoint.visualize}
          updateState={this.helpers.updateState}/>
      </div>
    )
  }
}

export default RegexToNFA;
