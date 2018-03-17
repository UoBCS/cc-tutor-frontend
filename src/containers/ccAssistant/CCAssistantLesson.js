import React, { Component } from 'react';
import { Choose } from 'react-extras';
import { Link } from 'react-router-dom';
import { Menu, Card, Header, Button, Icon, Tab } from 'semantic-ui-react';
import ui from 'utils/ui';
import api from 'api';
import clone from 'clone';
import brace from 'brace';
import AceEditor from 'react-ace';
import Terminal from 'react-bash';

import 'brace/mode/java';
import 'brace/theme/monokai';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './CCAssistantLesson.css';

export default class CCAssistantLesson extends Component {

  constructor(props) {
    super(props);

    const lessonData = this.props.location.state === undefined
                        ? { lessonData: null }
                        : this.props.location.state;

    this.state = Object.assign({}, lessonData, {
      originalLessonFiles: lessonData.lessonData === null ? null : clone(lessonData.lessonData.files),
      terminalHistory: [],
      ui: Object.assign({}, clone(ui.state), { loader: { main: false, submitLesson: false } })
    });
  }

  componentDidMount() {
    if (this.state.lessonData === null) {
      const params = this.props.match.params;

      api.cca.getLesson(params.cid, params.lid)
        .then(res => {
          this.setState({
            lessonData: res.data,
            originalLessonFiles: res.data.files
          });
        })
        .catch(err => {
          // TODO: err
        });
    }

    document.body.classList.add('CCAssistantLesson_body');
  }

  componentWillUnmount() {
    document.body.classList.remove('CCAssistantLesson_body');
  }

  eventHandlers = {
    editorChange: filename => {
      return newVal => {
        let lessonData = this.state.lessonData;

        lessonData.files[filename] = newVal;

        this.setState({ lessonData });
      };
    },

    submitClick: () => {
      const params = this.props.match.params;
      const data = Object.keys(this.state.lessonData.files).map(filename => ({
        name: filename,
        content: this.state.lessonData.files[filename]
      }));

      ui.obj.loader.show(this, 'submitLesson');
      api.cca.submitLesson(params.cid, params.lid, { files: data })
        .then(res => {
          ui.obj.loader.hide(this, 'submitLesson');
          console.log(res.data);

          let terminalHistory = this.state.terminalHistory;
          for (const line of res.data.output) {
            terminalHistory.push({ value: line });
          }

          this.setState({ terminalHistory });
        })
        .catch(err => {
          ui.obj.loader.hide(this, 'submitLesson');
          ui.obj.modal.showErrorFromData(this, err);
        });
    },

    resetFileClick: () => {
      let lessonData = this.state.lessonData;

      Object.keys(lessonData.files).forEach(filename => {
        lessonData.files[filename] = this.state.originalLessonFiles[filename];
      });

      this.setState({ lessonData });
    }
  }

  render() {
    const filePanes = this.state.lessonData === null ? null
    : Object.keys(this.state.lessonData.files).map((filename, idx) => ({
      menuItem: filename,
      render: () => (
        <Tab.Pane style={{ position: 'relative', padding: 0, border: 'none', background: 'transparent' }}>
          <AceEditor
            className='CCAssistantLesson_editor'
            mode='java'
            theme='monokai'
            width='auto'
            name={`code_editor_${idx}`}
            value={this.state.lessonData.files[filename]}
            onChange={this.eventHandlers.editorChange(filename)}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            fontSize={16}
            editorProps={{$blockScrolling: true}}
          />
        </Tab.Pane>
      )
    }));

    const instructions = this.state.lessonData && this.state.lessonData.instructions || [];

    return (
      <div className='CCAssistantLesson'>
        {ui.obj.modal.render(this)}

        <div className='CCAssistantLesson_contents'>
          <div className='CCAssistantLesson_instructions'>
            <Header as='h3' className='CCAssistantLesson_instructions_header'>Learn</Header>
            <div className='CCAssistantLesson_instructions_content' dangerouslySetInnerHTML={{__html: instructions.learn}}>
            </div>

            <Header as='h3' className='CCAssistantLesson_instructions_header'>Instructions</Header>
            <div className='CCAssistantLesson_instructions_content' dangerouslySetInnerHTML={{__html: instructions.instructions}}>
            </div>

            <Header as='h3' className='CCAssistantLesson_instructions_header'>Report a Bug</Header>
            <div className='CCAssistantLesson_instructions_content' dangerouslySetInnerHTML={{__html: instructions.report_bug}}>
            </div>

            <Button.Group width='2' fluid>
              <Button as={Link} to={`/cc-assistant/courses/${this.props.match.params.cid}`}>Back</Button>
              <Button as={Link} to='/dashboard'>Dashboard</Button>
            </Button.Group>
          </div>

          <div className='CCAssistantLesson_code'>
            <Tab className='CCAssistantLesson_code_tab' panes={filePanes} />
          </div>

          <div className='CCAssistantLesson_terminal_wrapper'>
            <Terminal
              prefix=''
              theme={Terminal.Themes.DARK}
              history={this.state.terminalHistory}
              className='CCAssistantLesson_terminal' />
          </div>

          <div className='CCAssistantLesson_actions'>
            <Button loading={this.state.ui.loader.submitLesson} primary onClick={this.eventHandlers.submitClick}>Submit</Button>
            <Button icon='refresh' onClick={this.eventHandlers.resetFileClick} />
          </div>
        </div>
      </div>
    );
  }

}
