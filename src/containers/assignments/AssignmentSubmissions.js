import React, { Component } from 'react';
import { Button, Card, Icon, Header, Label } from 'semantic-ui-react';
import { Choose, For, If } from 'react-extras';
import DataPlaceholder from 'components/DataPlaceholder/DataPlaceholder';
import clone from 'clone';
import api from 'api';
import ui from 'utils/ui';

export default class AssignmentSubmissions extends Component {

  state = {
    submissions: [],
    ui: clone(ui.state)
  }

  initializers = {
    getData: () => {
      ui.obj.loader.show(this);

      api.assignments.getSubmissions(this.props.match.params.id)
        .then(res => {
          ui.obj.loader.hide(this);
          this.setState({ submissions: res.data });
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
        });
    }
  }

  eventHandlers = {
    runTests: (studentId, index) => () => {
      ui.obj.loader.show(this);

      api.assignments.runTests(this.props.match.params.id, studentId)
        .then(res => {
          ui.obj.loader.hide(this);

          this.setState({
            submissions: this.state.submissions.map((s, i) => {
              if (index === i) {
                s.log = res.data.output;
              }

              return s;
            })
          });

          if (res.data.exit_code) {
            ui.obj.message.show(this, 'negative', 'Failed tests', 'Some tests have not been passed. Check the log for more details.');
          } else {
            ui.obj.message.show(this, 'positive', 'Passed tests', '');
          }
        })
        .catch(err => {
          ui.obj.loader.hide(this);
          ui.obj.message.showErrorFromData(this, err);
        });
    },

    viewLog: index => () => {
      let { log } = this.state.submissions[index];
      log = log.map((line, i) => <p style={{ lineHeight: 1 }} key={i}>{line}</p>);

      ui.obj.modal.show(this, 'Tests log', (
        <Choose>
          <Choose.When condition={log.length === 0}>
            <DataPlaceholder
              title='No logs available'
              subtitle=''
              icon='book'
            />
          </Choose.When>
          <Choose.Otherwise>
            <div style={{ fontFamily: 'monospace' }}>
              {log}
            </div>
          </Choose.Otherwise>
        </Choose>
      ), null, 'large');
    },

    back: () => {
      this.props.history.push(`/dashboard/assignments/${this.props.match.params.id}`);
    }
  }

  renderers = {
    content: () => {
      const { submissions } = this.state;

      return (
        <Choose>
          <Choose.When condition={submissions.length === 0}>
            <DataPlaceholder
              title='No submissions'
              subtitle=''
              icon='book'
            />
          </Choose.When>

          <Choose.Otherwise>
            <Card.Group>
              <For of={submissions} render={(submission, index) => (
                <Card key={index}>
                  <Card.Content>
                    <If condition={submission.late}>
                      <Label as='a' color='red' attached='top right'>Late</Label>
                    </If>
                    <Card.Header content={submission.student.name} />
                    <Card.Meta content={submission.student.email} />
                  </Card.Content>
                  <Card.Content extra>
                    <div className="ui two buttons">
                      <Button
                          basic
                          color='blue'
                          onClick={this.eventHandlers.runTests(submission.student.id, index)}>
                          Run tests
                      </Button>

                      <If condition={submission.log !== undefined}>
                        <Button
                            basic
                            color='blue'
                            onClick={this.eventHandlers.viewLog(index)}>
                            View log
                        </Button>
                      </If>
                    </div>
                  </Card.Content>
                </Card>
              )}/>
            </Card.Group>
          </Choose.Otherwise>
        </Choose>
      );
    },

    footer: () => (
      <Button animated basic onClick={this.eventHandlers.back}>
        <Button.Content visible>Back</Button.Content>
        <Button.Content hidden>
          <Icon name='left arrow' />
        </Button.Content>
      </Button>
    )
  }

  componentWillMount() {
    this.initializers.getData();
  }

  render() {
    return (
      <div className='dashboard-card'>
        {ui.obj.loader.render(this)}

        {ui.obj.modal.render(this)}

        <div className='dashboard-card-header'>
          <Header
              as='h1'
              className='light-heading'>
              Submissions
            </Header>
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
