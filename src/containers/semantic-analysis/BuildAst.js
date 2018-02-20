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

public class Node extends BaseNode {
    public Expression toAst() {
        return null;
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
        content: ''
      });

      input.newFile = null;

      this.setState({ files, input });
    },

    handleNextClick: () => {
      ui.obj.loader.show(this);

      api.semanticAnalysis.ast(this.props.data, this.state.files)
        .then(res => {
          ui.obj.loader.hide(this);

          const data = {};
          this.props.windowChangeHandler('typeChecking', data);
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          // TODO: handle
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
        console.log(err);
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
                Blah blah blah
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
          <Grid columns={2}>
            <Grid.Column>
              <Window title='Parse tree' titleColor='blue'>
                <div id='parse-tree-viz' style={{ height: 500 }}></div>
              </Window>
            </Grid.Column>

            <Grid.Column>
              <Input
                name='newFile'
                style={{ marginBottom: 20 }}
                action={<Button onClick={this.eventHandlers.createFileHandler} >Create</Button>}
                placeholder='New file...'
                onChange={this.eventHandlers.handleInputChange} />
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
