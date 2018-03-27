import React, { Component } from 'react';
import { Button, List } from 'semantic-ui-react';
import ui from 'utils/ui';
import clone from 'clone';

import './ActionsHistory.css';

export default class ActionsHistory extends Component {

  state = {
    actions: [],
    index: 0,
    ui: clone(ui.state)
  }

  eventHandlers = {
    showHistoryClick: () => {
      const mainContent = this.state.actions.map((action, index) =>
        <List.Item key={index}>
          <List.Content>
            {action.title}
          </List.Content>
        </List.Item>
      );

      const actionsContent = (
        <div>
          <Button basic onClick={this.state.ui.modal.handleClose(this)}>Close</Button>
          <Button primary icon='download' labelPosition='right' content='Save' />
        </div>
      );

      ui.obj.modal.show(this, 'Algorithm history', <List>{mainContent}</List>, actionsContent, 'small')
    }
  }

  addOrSelect = (idx, obj) => {
    let { actions, index } = this.state;

    if (idx === this.state.actions.length) {
      actions.push(obj);
    }

    index = idx;

    this.setState({ actions, index });
  }

  render() {
    const { actions, index } = this.state;

    return (
      <div>
        {ui.obj.modal.render(this)}

        <div className='viz-history'>
          <div className='viz-history-current'>
            {actions
              && actions.length > 0
              && actions[index] !== undefined
              ? (actions[index].title !== undefined ? actions[index].title : actions[index])
              : 'A description of the algorithm steps will be shown here.'
            }
          </div>

          <List bulleted horizontal className='viz-history-options'>
            <List.Item as='a' onClick={this.eventHandlers.showHistoryClick}>Show history</List.Item>
          </List>
        </div>
      </div>
    );
  }

}
