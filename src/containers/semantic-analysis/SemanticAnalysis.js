import React, { Component } from 'react';
import WindowManager from 'containers/WindowManager';
import InputData from 'containers/syntax-analysis/InputData';
import BuildAst from './BuildAst';
import TypeChecking from './TypeChecking';

export default class SemanticAnalysis extends WindowManager {
  state = {
    windows: {
      input: InputData,
      buildAst: BuildAst,
      typeChecking: TypeChecking
    }
  }

  componentWillMount() {
    this.setCurrentWindow('input', {
      'nextWindow': 'buildAst'
    });
  }
}
