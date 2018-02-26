import React, { Component } from 'react';
import { Button, Header, Menu, Grid, Icon, Tab, Input } from 'semantic-ui-react';
import Window from 'components/Window/Window';
import tree from 'utils/tree';
import ui from 'utils/ui';
import api from 'api';
import clone from 'clone';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/java';
import 'brace/theme/monokai';

const nodeFileContents = `import com.cctutor.app.ast.BaseNode;

public class Node extends BaseNode<String, Object> {

    /*
     * Available variables:
     *
     * String value;
     * BaseNode<String> parent;
     * ArrayList<BaseNode<String>> children;
     */

    public Node(String filename, Class<?> classObj) throws Throwable {
        super(filename, classObj);
    }

    public Node(String value) {
        super(value);
    }

    /*
     * Implement this
     */
    public Object toAst() {
        if (value.equals("node value 1")) {
            return null;
        } else if (value.equals("node value 2")) {
            return null;
        } else {
            return null;
        }
    }
}`
;

export default class BuildAst extends Component {

  state = {
    parseTree: {
      instance: null,
      nodes: null,
      edges: null
    },

    files: [
      {
        name: 'Node.java',
        content: nodeFileContents
      }
    ],

    input: {
      newFile: ''
    },

    ui: clone(ui.state)
  }

  initializers = {
    setParseTreeData: data => {
      this.setState({
        parseTree: tree.visDataFormat('parse-tree-viz', data, 'node'),
      });
    }
  }

  eventHandlers = {
    editorOnChangeHandler: filename => {
      return newVal => {
        let files = this.state.files;

        for (let file of files) {
          if (file.name === filename) {
            file.content = newVal;
          }
        }

        this.setState({ files });
      };
    },

    handleInputChange: event => {
      const target = event.target;
      let input = this.state.input;
      input[target.name] = target.value;
      this.setState({ input });
    },

    createFileHandler: () => {
      let { files, input } = this.state;

      files.push({
        name: this.state.input.newFile,
        content: `public class ${this.state.input.newFile.replace(/\.[^/.]+$/, '')} {\n\n}`
      });

      input.newFile = '';

      this.setState({ files, input });
    },

    deleteFileHandler: () => {
      let { files, input } = this.state;

      if (input.newFile === 'Node.java') {
        ui.obj.message.show(this, 'negative', 'Error', 'Cannot delete Node.java file.');
        return;
      }

      let idx = -1;
      for (let i = 0; i < files.length; i++) {
        if (files[i].name === input.newFile) {
          idx = i;
          break;
        }
      }

      if (idx > -1) {
        files.splice(idx, 1);
      }

      input.newFile = '';

      this.setState({ files, input });
    },

    handleNextClick: () => {
      ui.obj.loader.show(this);

      api.semanticAnalysis.ast(this.props.data, this.state.files)
        .then(res => {
          ui.obj.loader.hide(this);

          if (res.data.exit_code !== 0) {
            ui.obj.message.show(this, 'negative', 'Error', 'An error has occurred.');
          } else {
            const data = res.data.output;
            this.props.windowChangeHandler('typeChecking', data);
          }
        })
        .catch(err => {
          ui.obj.loader.hide(this);

          ui.obj.message.show(this, 'negative', 'Error', ui.renderErrors(err));
        });
    },

    handlePreviousClick: () => {
      this.props.windowChangeHandler('input', {
        'nextWindow': 'buildAst'
      });
    }
  }

  componentDidMount() {
    ui.obj.loader.show(this);

    api.ll1.parse(this.props.data, true)
      .then(res => {
        this.initializers.setParseTreeData(res.data.parse_tree);
        ui.obj.loader.hide(this);
      })
      .catch(err => {
        ui.obj.message.show(this, 'negative', 'Error', ui.renderErrors(err));
        ui.obj.loader.hide(this);
      });
  }

  render() {
    const filePanes = this.state.files === null ? null
    : this.state.files.map((file, idx) => ({
      menuItem: file.name,
      render: () => (
        <Tab.Pane style={{ position: 'relative', padding: 0, border: 'none', background: 'transparent' }}>
          <AceEditor
            className='CCAssistantLesson_editor'
            mode='java'
            theme='monokai'
            width='auto'
            name={`code_editor_${idx}`}
            value={file.content}
            onChange={this.eventHandlers.editorOnChangeHandler(file.name)}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            fontSize={16}
            editorProps={{$blockScrolling: true}}
          />
        </Tab.Pane>
      )
    }));

    return (
      <div className='BuildAst dashboard-card'>
        {ui.obj.loader.render(this)}

        <div className='dashboard-card-header'>
          <Grid className='viz-heading'>
            <Grid.Column floated='left' width={9} className='viz-heading-left '>
              <Header
                as='h1'
                className='light-heading'>
                Create AST
              </Header>
              <p>
                Create the AST classes/types for the parse tree.
              </p>
            </Grid.Column>
            <Grid.Column floated='right' width={1}>
              <Button
                circular
                icon='question'
                color='blue'
                style={{ float: 'right' }}/>
              <br style={{ clear: 'both' }}/>
            </Grid.Column>
          </Grid>
        </div>

        <div className='dashboard-card-content'>
          {ui.obj.message.render(this)}

          <Grid columns={2}>
            <Grid.Column>
              <Window title='Parse tree' titleColor='blue'>
                <div id='parse-tree-viz' style={{ height: 500 }}></div>
              </Window>
            </Grid.Column>

            <Grid.Column>
              <Input type='text' placeholder='File...' action style={{ marginBottom: 20 }}>
                <input name='newFile' value={this.state.input.newFile} onChange={this.eventHandlers.handleInputChange} />
                <Button onClick={this.eventHandlers.createFileHandler}>Create</Button>
                <Button onClick={this.eventHandlers.deleteFileHandler}>Delete</Button>
              </Input>

              <Tab panes={filePanes} />
            </Grid.Column>
          </Grid>
        </div>

        <div className='dashboard-card-footer'>
          <Button animated onClick={this.eventHandlers.handlePreviousClick}>
            <Button.Content visible>Previous</Button.Content>
            <Button.Content hidden>
              <Icon name='left arrow' />
            </Button.Content>
          </Button>

          <Button animated primary floated='right' onClick={this.eventHandlers.handleNextClick}>
            <Button.Content visible>Next</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>
          <br style={{ clear: 'both' }}/>
        </div>
      </div>
    );
  }

}
