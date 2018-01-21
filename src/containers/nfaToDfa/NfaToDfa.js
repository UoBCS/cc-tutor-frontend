import React, { Component } from 'react';
import WindowManager from 'containers/WindowManager';
import InputNfa from './InputNfa';
import NfaToDfaViz from './NfaToDfaViz';

export default class NfaToDfa extends WindowManager {
  state = {
    windows: {
      input: InputNfa,
      viz: NfaToDfaViz
    },
    currentWindow: null
  }

  componentWillMount() {
    this.setCurrentWindow('input');
  }
}

