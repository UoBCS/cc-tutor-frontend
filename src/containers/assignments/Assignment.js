import React, { Component } from 'react';
import { Button, Header, Icon, Grid } from 'semantic-ui-react';
import { If } from 'react-extras';
import Window from 'components/Window/Window';
import VisualizationControl from 'components/VisualizationControl/VisualizationControl';
import VisualizationElement from 'components/VisualizationElement/VisualizationElement';
import JavaEditor from 'components/JavaEditor/JavaEditor';
import clone from 'clone';
import api from 'api';
import ui from 'utils/ui';
import breakpoints from 'utils/breakpoints';
import globalBreakpointProcessor from 'utils/globalBreakpointProcessor';
import storage from 'utils/storage';
import strings from 'utils/strings';
import automata from 'utils/automata';

export default class Assignment extends Component {

  state = {
    assignment: null,

    contents: null,

    user: storage.get('user_data'),

    ui: clone(ui.state)
  }

  initializers = {
    getData: cb => {
      ui.obj.loader.show(this);

      api.assignments.get(this.props.match.params.id)
        .then(res => {
          ui.obj.loader.hide(this);

          this.setState({
            assignment: res.data.assignment,
            contents: res.data.assignment.type === 'impl_general'
              ? res.data.contents
              : {
                input: res.data.contents.input,
                data: res.data.contents.breakpoints ? res.data.contents.breakpoints : [],
                index: -1
              }
          }, cb);
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
        });
    }
  }

  eventHandlers = {
    saveAssignment: () => {
      const { assignment } = this.state;

      const data = {
        extra: assignment.type === 'impl_general'
          ? this.refs.editor.getFiles()
          : this.state.contents.data
      };

      ui.obj.loader.show(this);

      api.assignments.update(this.props.match.params.id, { assignment: data })
        .then(res => {
          ui.obj.loader.hide(this);
          ui.obj.message.showInfo(this, 'The assignment has been updated');
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
        });
    },

    submitAssignment: () => {
      ui.obj.loader.show(this);

      api.assignments.submit(this.props.match.params.id)
        .then(res => {
          ui.obj.loader.hide(this);
          ui.obj.message.showInfo(this, 'The assignment has been submitted');
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
        });
    },

    viewSubmissions: () => {
      this.props.history.push(`/dashboard/assignments/${this.props.match.params.id}/submissions`);
    },

    back: () => {
      this.props.history.push('/dashboard/assignments');
    }
  }

  renderers = Object.assign({}, {
    content: () => {
      let content = null;
      let { assignment } = this.state;

      if (assignment === null) {
        return null;
      }

      switch (assignment.type) {
        case 'impl_general':
          content = this.renderers.implGeneralContent();
          break;

        case 'regex_to_nfa':
          content = this.renderers.regexToNfaContent();
          break;

        case 'nfa_to_dfa':
          content = this.renderers.nfaToDfaContent();
          break;

        default:
          content = null;
          break;
      }

      return (
        <div>
          <Header as='h3'>Description</Header>
          <p>
            {assignment.description}
          </p>

          <Header as='h3'>Assignment content</Header>
          {content}
        </div>
      );
    },

    implGeneralContent: () => {
      const initialContent = this.state.user.teacher
        ? strings.javaEditorInitialContent
        : null
      ;

      return (
        <JavaEditor
          ref='editor'
          files={this.state.contents}
          initialContent={initialContent} />
      );
    },

    regexToNfaContent: () => (
      <div>
        <VisualizationElement.ActionsHistory ref='actionsHistory'/>

        <Header as='h4'>Regular Expression: {this.state.contents === null ? null : this.state.contents.input.regex}</Header>

        <Window title='Non-deterministic finite automaton' titleColor='blue'>
          <div id='nfa-viz' style={{ height: 500 }}></div>
        </Window>

        <VisualizationControl
          active
          breakpoint={this.state.contents}
          visualizeBreakpointForward={globalBreakpointProcessor.eventHandlers.visualizeForward('contents').bind(this)}
          visualizeBreakpointBackward={globalBreakpointProcessor.eventHandlers.visualizeBackward('contents').bind(this)}
          addBreakpointHandler={breakpoints.eventHandlers.showActionChooser.bind(this)}
          updateState={this.helpers.updateState}/>
      </div>
    ),

    nfaToDfaContent: () => (
      <div>
        <VisualizationElement.ActionsHistory ref='actionsHistory'/>

        <Grid columns={2}>
          <Grid.Column>
            <Window title='Non-deterministic finite automaton' titleColor='blue'>
              <div id='nfa-viz' style={{ height: 500 }}></div>
            </Window>
          </Grid.Column>
          <Grid.Column>
            <Window title='Deterministic finite automaton' titleColor='blue'>
              <div id='dfa-viz' style={{ height: 500 }}></div>
            </Window>
          </Grid.Column>
        </Grid>

        <VisualizationControl
          active
          breakpoint={this.state.contents}
          visualizeBreakpointForward={globalBreakpointProcessor.eventHandlers.visualizeForward('contents').bind(this)}
          visualizeBreakpointBackward={globalBreakpointProcessor.eventHandlers.visualizeBackward('contents').bind(this)}
          addBreakpointHandler={breakpoints.eventHandlers.showActionChooser.bind(this)}
          updateState={this.helpers.updateState}/>
      </div>
    ),

    footer: () => (
      <div>
        <Button animated basic onClick={this.eventHandlers.back}>
          <Button.Content visible>Back</Button.Content>
          <Button.Content hidden>
            <Icon name='left arrow' />
          </Button.Content>
        </Button>

        <Button animated primary floated='right' onClick={this.eventHandlers.saveAssignment}>
          <Button.Content visible>Save</Button.Content>
          <Button.Content hidden>
            <Icon name='upload' />
          </Button.Content>
        </Button>

        <If condition={this.state.user.teacher === 1}>
          <Button basic color='blue' floated='right' onClick={this.eventHandlers.viewSubmissions}>
            View submissions
          </Button>
        </If>

        <If condition={this.state.user.teacher === 0}>
          <Button basic color='blue' floated='right' onClick={this.eventHandlers.submitAssignment}>
            Submit
          </Button>
        </If>

        <br style={{ clear: 'both' }}/>
      </div>
    )
  },
  Object.keys(breakpoints.renderers).reduce((prev, curr) => {
    prev[curr] = breakpoints.renderers[curr].bind(this);
    return prev;
  }, {}))

  helpers = {
    updateState: (obj, cb) => {
      this.setState(obj, cb);
    }
  }

  componentDidMount() {
    this.initializers.getData(() => {
      const { assignment, contents } = this.state;

      breakpoints.initializers.setAlgorithm(assignment.type);

      switch (assignment.type) {
        case 'regex_to_nfa':
          this.setState({
            nfa: automata.createEmpty('nfa-viz')
          });
          break;

        case 'nfa_to_dfa':
          this.setState({
            nfa: automata.visDataFormat('nfa-viz', contents.input),
            dfa: automata.createEmpty('dfa-viz')
          });
          break;

        default: break;
      }
    });
  }

  render() {
    const { assignment } = this.state;

    return (
      <div className='dashboard-card'>
        {ui.obj.loader.render(this)}

        {ui.obj.modal.render(this)}

        <div className='dashboard-card-header'>
          <Header
            as='h1'
            className='light-heading'>

            {assignment === null ? 'Assignment' : `Assignment: ${assignment.title}`}
          </Header>
          {
            assignment === null
            ? null
            : <p style={{ padding: '0px 25px 10px 25px', color: '#676767', fontSize: '0.9em' }}>Due: {assignment.due_date}</p>
          }
        </div>

        <div className='dashboard-card-content'>
          {ui.obj.message.render(this)}

          {this.renderers.content()}
        </div>

        <div className='dashboard-card-footer'>
          {this.renderers.footer()}
        </div>
      </div>
    );
  }

}
