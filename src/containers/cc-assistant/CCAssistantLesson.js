import React, { Component } from 'react';
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

    this.state = Object.assign({}, this.props.location.state, {
      ui: Object.assign({}, clone(ui.state), { loader: { main: false, submitLesson: false } })
    });

    console.log(this.state);
  }

  componentDidMount() {
    document.body.classList.add('CCAssistantLesson_body');
  }

  componentWillUnmount() {
    document.body.classList.remove('CCAssistantLesson_body');
  }

  eventHandlers = {
    editorOnChangeHandler: filename => {
      return newVal => {
        let lessonData = this.state.lessonData;

        lessonData.files[filename] = newVal;

        this.setState({ lessonData });
      };
    },

    submitClickHandler: () => {
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
        })
        .catch(err => {
          ui.obj.loader.hide(this, 'submitLesson');
        });
    },

    resetFileClickHandler: (filename, editor) => {

    }
  }

  render() {
    let files = this.state.lessonData.files;
    const filePanes = Object.keys(files).map((filename, idx) => ({
      menuItem: filename,
      render: () => (
        <Tab.Pane style={{ position: 'relative', padding: 0, border: 'none', background: 'transparent' }}>
          <AceEditor
            className='CCAssistantLesson_editor'
            mode='java'
            theme='monokai'
            name={`code_editor_${idx}`}
            value={files[filename]}
            onChange={this.eventHandlers.editorOnChangeHandler(filename)}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            fontSize={16}
            editorProps={{$blockScrolling: true}}
          />
        </Tab.Pane>
      )
    }));

    return (
      <div className='CCAssistantLesson'>
        <Menu style={{ backgroundColor: '#152B39', boxShadow: 'none', border: 'none' }} inverted borderless>
          <Menu.Menu position='right'>
            <Menu.Item name='home' />
            <Menu.Item name='messages' />
            <Menu.Item name='friends' />
          </Menu.Menu>
        </Menu>

        <div className='CCAssistantLesson_contents'>
          <div className='CCAssistantLesson_instructions'>
            <Header as='h3' className='CCAssistantLesson_instructions_header'>Learn</Header>
            <div className='CCAssistantLesson_instructions_content'>

            </div>

            <Header as='h3' className='CCAssistantLesson_instructions_header'>Instructions</Header>
            <div className='CCAssistantLesson_instructions_content'>

            </div>

            <Header as='h3' className='CCAssistantLesson_instructions_header'>Report a Bug</Header>
            <div className='CCAssistantLesson_instructions_content'>

            </div>
          </div>

          <div className='CCAssistantLesson_code'>
            <Tab panes={filePanes} />
          </div>

          <div className='CCAssistantLesson_terminal_wrapper'>
            <Terminal prefix='' theme={Terminal.Themes.DARK} className='CCAssistantLesson_terminal' />
          </div>

          <div className='CCAssistantLesson_actions'>
            <Button loading={this.state.ui.loader.submitLesson} primary onClick={this.eventHandlers.submitClickHandler}>Submit</Button>
            <Button icon='refresh' onClick={this.eventHandlers.resetFileClickHandler} />
          </div>
        </div>
      </div>
    );
  }

}
