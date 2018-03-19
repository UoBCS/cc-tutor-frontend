import React, { Component } from 'react';
import WindowManager from 'containers/WindowManager';
import InputParserData from '../InputParserData';
import LRViz from './LRViz';

export default class LR extends WindowManager {
  state = {
    windows: {
      input: InputParserData,
      viz: LRViz
    }
  }

  componentWillMount() {
    this.setCurrentWindow('input', {
      'nextWindow': 'viz'
    });
  }
}
