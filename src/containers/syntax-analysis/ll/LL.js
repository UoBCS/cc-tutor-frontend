import React, { Component } from 'react';
import InputData from '../InputData';
import LLViz from './LLViz';
import ui from 'utils/ui';
import clone from 'clone';

export default class LL extends Component {

  state = {
    windows: {
      input: InputData,
      viz: LLViz
    },
    currentWindow: null,
    ui: clone(ui.state)
  }

  componentWillMount() {
    this.setCurrentWindow('input', {
      'nextWindow': 'viz'
    });
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
