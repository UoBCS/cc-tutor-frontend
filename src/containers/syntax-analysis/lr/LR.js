import React, { Component } from 'react';
import WindowManager from 'containers/WindowManager';
import InputData from '../InputData';
import LRViz from './LRViz';

export default class LR extends WindowManager {
  state = {
    windows: {
      input: InputData,
      viz: LRViz
    }
  }

  componentWillMount() {
    this.setCurrentWindow('input', {
      'nextWindow': 'viz'
    });
  }
}
