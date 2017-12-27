import React, { Component } from 'react';
import { Button, Container, Dropdown, Form, Icon, Input, Segment, Header, Menu, Grid } from 'semantic-ui-react';
import InputNfa from './InputNfa';
import NfaToDfaViz from './NfaToDfaViz';
import misc from 'utils/misc';

class NfaToDfa extends Component {

  state = {
    windows: {
      input: InputNfa,
      viz: NfaToDfaViz
    },
    currentWindow: null,
    ui: misc.lazyClone(this.props.uiState)
  }

  componentWillMount() {
    this.setCurrentWindow('input');
  }

  setCurrentWindow = (index, data = null) => {
    let currentWindow = React.createElement(this.state.windows[index], {
      data,
      windowChangeHandler: this.windowChangeHandler
    });

    this.setState({ currentWindow });
  }

  windowChangeHandler = (windowIndex, data) => {
    /*return () => {
      this.setCurrentWindow(windowIndex, data);
    }*/
    this.setCurrentWindow(windowIndex, data);
  }

  render() {
    return !this.state.currentWindow ? null : this.state.currentWindow;
  }

}

export default NfaToDfa;
