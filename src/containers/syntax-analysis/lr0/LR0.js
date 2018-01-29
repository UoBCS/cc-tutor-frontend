import React, { Component } from 'react';
import WindowManager from 'containers/WindowManager';
import InputData from '../InputData';
import LR0Viz from './LR0Viz';

export default class LL1 extends WindowManager {
  state = {
    windows: {
      input: InputData,
      viz: LR0Viz
    }
  }

  componentWillMount() {
    this.setCurrentWindow('input', {
      'nextWindow': 'viz'
    });
  }
}
