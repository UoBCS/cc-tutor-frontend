import React, { Component } from 'react';
import api from 'api';

class NfaToDfaViz extends Component {

  componentWillMount() {
    api.nfaToDfa(this.props.data)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return <div>sdjsds</div>
  }

}

export default NfaToDfaViz;
