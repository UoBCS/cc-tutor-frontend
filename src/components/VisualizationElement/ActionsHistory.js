import React, { Component } from 'react';
import misc from 'utils/misc';

class ActionsHistory extends Component {

  /*addToActionsHistory = obj => {
    let vizElements = this.state.vizElements;
    vizElements.actionsHistory.push(obj);
    this.setState({ vizElements });
  }*/

  render() {
    return (
      <div>
        <p>
          {this.props.actions.length ? misc.last(this.props.actions).title : null}
        </p>
      </div>
    );
  }

}

export default ActionsHistory;
