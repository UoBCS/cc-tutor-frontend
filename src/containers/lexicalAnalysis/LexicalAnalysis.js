import React, { Component } from 'react';
import WindowManager from 'containers/WindowManager';
import InputData from './InputData';
import LexicalAnalysisViz from './LexicalAnalysisViz';

export default class LexicalAnalysis extends WindowManager {
  state = {
    windows: {
      input: InputData,
      viz: LexicalAnalysisViz
    },
    currentWindow: null
  }

  componentWillMount() {
    this.setCurrentWindow('input');
  }
}
