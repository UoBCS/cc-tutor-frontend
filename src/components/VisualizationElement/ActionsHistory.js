import React, { Component } from 'react';
import { Button, List } from 'semantic-ui-react';
import misc from 'utils/misc';
import ui from 'utils/ui';
import clone from 'clone';

import './ActionsHistory.css';

class ActionsHistory extends Component {

  static addOrSelect = (component, index, obj) => {
    let vizElements = component.state.vizElements;

    if (index === vizElements.actionsHistory.length) {
      vizElements.actionsHistory.push(obj);
    }

    vizElements.actionsHistoryIndex = index;

    component.setState({ vizElements }, () => {
      console.log(vizElements.actionsHistory[vizElements.actionsHistoryIndex]);
    });
  }

  state = {
    ui: clone(ui.state)
  }

  eventHandlers = {
    handleShowHistoryClick: () => {
      const mainContent = this.props.actions.map((action, index) =>
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
            {this.props.actions.length
              ? this.props.actions[this.props.index].title
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
