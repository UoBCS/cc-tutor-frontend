import React, { Component } from 'react';
import { Tab, Input, Button } from 'semantic-ui-react';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/java';
import 'brace/theme/monokai';

export default class JavaEditor extends Component {

  state = {
    files: this.props.files ? this.props.files : [],

    input: {
      file: ''
    }
  }

  eventHandlers = {
    inputChange: event => {
      const target = event.target;
      let input = this.state.input;
      input[target.name] = target.value;
      this.setState({ input });
    },

    createFile: () => {
      let { files, input } = this.state;
      let className = this.state.input.file.replace(/\.[^/.]+$/, '');

      files.push({
        name: this.state.input.file,
        content: this.props.initialContent
          ? this.props.initialContent.replace('|{className}|', className)
          : `public class ${className} {\n\n}`
      });

      input.file = '';

      this.setState({ files, input });
    },

    deleteFile: () => {
      let { files, input } = this.state;

      let idx = -1;
      for (let i = 0; i < files.length; i++) {
        if (files[i].name === input.file) {
          idx = i;
          break;
        }
      }

      if (idx > -1) {
        files.splice(idx, 1);
      }

      input.file = '';

      this.setState({ files, input });
    },

    editorChange: filename => newVal => {
      let { files } = this.state;

      for (let file of files) {
        if (file.name === filename) {
          file.content = newVal;
        }
      }

      this.setState({ files });
    }
  }

  getFiles = () => {
    return this.state.files;
  }

  render() {
    const filePanes = this.state.files === null ? null
    : this.state.files.map((file, idx) => ({
      menuItem: file.name,
      render: () => (
        <Tab.Pane style={{ position: 'relative', padding: 0, border: 'none', background: 'transparent' }}>
          <AceEditor
            mode='java'
            theme='monokai'
            width='auto'
            name={`code_editor_${idx}`}
            value={file.content}
            onChange={this.eventHandlers.editorChange(file.name)}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            fontSize={16}
            editorProps={{$blockScrolling: true}}
          />
        </Tab.Pane>
      )
    }));

    return (
      <div style={{ margin: '20px 0' }}>
        <Input type='text' placeholder='File...' action>
          <input name='file' value={this.state.input.file} onChange={this.eventHandlers.inputChange} />
          <Button onClick={this.eventHandlers.createFile}>Create</Button>
          <Button onClick={this.eventHandlers.deleteFile}>Delete</Button>
        </Input>

        <Tab style={{ marginTop: 16 }} panes={filePanes} />
      </div>
    )
  }

}
