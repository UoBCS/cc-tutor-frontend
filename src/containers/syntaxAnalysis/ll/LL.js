import React, { Component } from 'react';
import WindowManager from 'containers/WindowManager';
import InputData from '../InputData';
import LLViz from './LLViz';

export default class LL extends WindowManager {
  state = {
    windows: {
      input: InputData,
      viz: LLViz
    }
  }

  componentWillMount() {
    this.setCurrentWindow('input', {
      'nextWindow': 'viz'
    });
  }
}
