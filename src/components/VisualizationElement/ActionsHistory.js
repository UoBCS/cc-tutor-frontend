import React, { Component } from 'react';
import { Button, List } from 'semantic-ui-react';
import misc from 'utils/misc';
import ui from 'utils/ui';
import clone from 'clone';

import './ActionsHistory.css';

class ActionsHistory extends Component {

  addOrSelect = (idx, obj) => {
    let actions = this.state.actions;
    let index = this.state.index;

    if (idx === this.state.actions.length) {
      actions.push(obj);
    }

    index = idx;

    this.setState({ actions, index }, () => {
      //console.log(vizElements.actionsHistory[vizElements.actionsHistoryIndex]);
    });
  }

  state = {
    actions: [],
    index: 0,
    ui: clone(ui.state)
  }

  eventHandlers = {
    handleShowHistoryClick: () => {
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

  render() {
    return (
      <div>
        {ui.obj.modal.render(this)}

        <div className='viz-history'>
          <p className='viz-history-current left'>
            {this.state.actions.length
              ? this.state.actions[this.state.index].title
              : 'A description of the algorithm steps will be shown here.'
            }
          </p>

          <List bulleted horizontal className='viz-history-options right'>
            <List.Item as='a' onClick={this.eventHandlers.handleShowHistoryClick}>Show history</List.Item>
            <List.Item as='a'>Close</List.Item>
          </List>
          <br style={{ clear: 'both' }}/>
        </div>
      </div>
    );
  }

}

export default ActionsHistory;
