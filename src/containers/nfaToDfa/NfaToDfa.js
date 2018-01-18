import React, { Component } from 'react';
import InputNfa from './InputNfa';
import NfaToDfaViz from './NfaToDfaViz';
import ui from 'utils/ui';
import clone from 'clone';

export default class NfaToDfa extends Component {

  state = {
    windows: {
      input: InputNfa,
      viz: NfaToDfaViz
    },
    currentWindow: null,
    ui: clone(ui.state)
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
    this.setCurrentWindow(windowIndex, data);
  }

  render() {
    return !this.state.currentWindow ? null : this.state.currentWindow;
  }

}
