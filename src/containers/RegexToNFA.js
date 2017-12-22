import React, { Component } from 'react';
import { Form, Icon, Input, Segment, Header, Menu, Grid } from 'semantic-ui-react';
import ParseTreeViz from 'components/ParseTreeViz';
import { Graph } from 'react-d3-graph';
//import SigmaLoader from 'components/SigmaLoader';
//import { Sigma, RandomizeNodePositions, RelativeSize } from 'react-sigma';
import api from 'api';
import misc from 'utils/misc';

class RegexToNFA extends Component {
  state = {
    regexInput: '',
    regexTreeData: null,
    conversionSteps: null,
    currentNfa: {
      nodes: [],
      links: []
    },
    currentStep: {
      action: '',
      index: 0
    },
    ui: misc.lazyClone(this.props.uiState)
  }

  handleInputChange = event => {
    const target = event.target;

    this.setState({
      [target.name]: target.value
    });
  }

  handleNextClick = () => {
    let step = this.state.conversionSteps[this.state.currentStep.index];
    let currentNfa = this.state.currentNfa;

    currentNfa.nodes.push({id: step.entry});
    currentNfa.nodes.push({id: step.exit});
    currentNfa.links.push({source: step.entry, target: step.exit});

    let currentStep = this.state.currentStep;
    currentStep.index++;

    this.setState({ currentStep, currentNfa });
  }

  handlePreviousClick = () => {
    /*let currentStep = this.state.currentStep;
    currentStep.index--;

    this.setState({ currentStep });*/
  }

  handleRegexToNfa = () => {
    this.props.ui.loader.show(this, 'main');

    api.regexToNfa(this.state.regexInput)
      .then(res => {
        this.props.ui.loader.hide(this, 'main');
        console.log(res.data);
        this.setState({
          regexTreeData: res.data.regex_tree,
          conversionSteps: res.data.regex_tree_to_nfa_steps,
          nfa: res.data.nfa
        }, () => {
          this.handleNextClick();
        });
      })
      .catch(err => {
        this.props.ui.loader.hide(this, 'main');
        console.log(err);
      });
  }

  render() {
    // steps={this.state.conversionSteps} currentStep={this.state.currentStep.index}

    const nfaConfig = {
        nodeHighlightBehavior: true,
        node: {
            color: 'lightgreen',
            size: 120,
            highlightStrokeColor: 'blue'
        },
        link: {
            highlightColor: 'lightblue'
        }
    };

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
            {this.state.currentNfa.nodes.length
              ? <Graph id='fa-viz' data={this.state.currentNfa} config={nfaConfig} />
              : null
            }
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
            <Input name='regexInput' value={this.state.regexInput} onChange={this.handleInputChange} placeholder='Regular expression' icon={<Icon name='search' inverted circular link onClick={this.handleRegexToNfa} />} />
          </Form.Group>
        </Form>

        {this.props.ui.loader.render(this, 'main')}
        {body}

        <Segment inverted style={{ position: 'fixed', width: '100%', bottom: 0, borderRadius: 0 }}>
          <Menu inverted secondary>
            <Menu.Item name='previous' onClick={this.handlePreviousClick} />
            <Menu.Item name='reset' />
            <Menu.Item name='checkYourAnswer' />
            <Menu.Item name='next' onClick={this.handleNextClick} />
          </Menu>
        </Segment>
      </div>
    )
  }
}

export default RegexToNFA;
