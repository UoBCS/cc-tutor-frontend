import React, { Component } from 'react';
import WindowManager from 'containers/WindowManager';
import InputParserData from '../InputParserData';
import LL1Viz from './LL1Viz';

export default class LL1 extends WindowManager {
  state = {
    windows: {
      input: InputParserData,
      viz: LL1Viz
    }
  }

  componentWillMount() {
    this.setCurrentWindow('input', {
      'nextWindow': 'viz'
    });
  }
}
