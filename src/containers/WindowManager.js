import React, { Component } from 'react';

export default class WindowManager extends Component {
  state = {
    windows: {},
    currentWindow: null
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
