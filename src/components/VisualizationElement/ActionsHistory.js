import React, { Component } from 'react';
import misc from 'utils/misc';
import { List } from 'semantic-ui-react';

import './ActionsHistory.css';

class ActionsHistory extends Component {

  static add = (component, obj) => {
    let vizElements = component.state.vizElements;
    vizElements.actionsHistory.push(obj);
    component.setState({ vizElements });
  }

  render() {
    return (
      <div className='viz-history'>
        <p className='viz-history-current left'>
          {this.props.actions.length
            ? misc.last(this.props.actions).title
            : 'A description of the algorithm steps will be shown here.'}
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
