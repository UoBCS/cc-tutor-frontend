import React, { Component } from 'react';
import misc from 'utils/misc';
import { List } from 'semantic-ui-react';

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

  render() {
    return (
      <div className='viz-history'>
        <p className='viz-history-current left'>
          {this.props.actions.length
            ? this.props.actions[this.props.index].title
            : 'A description of the algorithm steps will be shown here.'
          }
        </p>

        <List bulleted horizontal className='viz-history-options right'>
          <List.Item as='a'>Show history</List.Item>
          <List.Item as='a'>Close</List.Item>
        </List>
        <br style={{ clear: 'both' }}/>
      </div>
    );
  }

}

export default ActionsHistory;
