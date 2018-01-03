import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import objectPath from 'object-path';
import misc from 'utils/misc';

import './VisualizationControl.css';

export default class VisualizationControl extends Component {

  state = {
    forwardBtnActive: true,
    backwardBtnActive: false
  }

  breakpoint = {
    getPath: () => {
      let path = '';

      if (this.props.breakpoint.scopeStack.length === 0) {
        return this.props.breakpoint.indexStack[this.props.breakpoint.indexStack.length - 1] + '';
      }

      for (var i = 0; i < this.props.breakpoint.scopeStack.length; i++) {
        path += this.props.breakpoint.indexStack[i] + '.' + this.props.breakpoint.scopeStack[i] + '.'
      }

      path += this.props.breakpoint.indexStack[i];

      return path;
    },

    getCurrent: () => {
      let path = this.breakpoint.getPath();
      return objectPath.get(this.props.breakpoint.data, path);
    },

    getIndex: () => {
      return misc.last(this.props.breakpoint.indexStack);
    },

    updateIndex: (direction = 1) => {
      let breakpointsObj = this.props.breakpoint;
      let lastIndex = misc.last(breakpointsObj.indexStack);

      if (direction === 1) {
        breakpointsObj.indexStack[breakpointsObj.indexStack.length - 1]++;
      } else {
        breakpointsObj.indexStack[breakpointsObj.indexStack.length - 1]--;
      }
      this.props.updateState({ breakpointsObj });
    }
  }

  eventHandlers = {
    handleForwardBtnClick: () => {
      let breakpoint = this.breakpoint.getCurrent();

      this.props.visualizeBreakpointForward(breakpoint);

      this.breakpoint.updateIndex();

      this.setState({
        backwardBtnActive: this.breakpoint.getIndex() > 0,
        forwardBtnActive: this.breakpoint.getCurrent() !== undefined
      });
    },

    handleBackBtnClick: () => {
      this.breakpoint.updateIndex(-1);

      let path = this.breakpoint.getPath();
      let breakpoint = objectPath.get(this.props.breakpoint.data, path);

      this.props.visualizeBreakpointBackward(breakpoint);

      this.setState({
        backwardBtnActive: this.breakpoint.getIndex() > 0,
        forwardBtnActive: breakpoint !== undefined
      });
    },

    handleStepIntoBtnClick: () => {

    },

    handleCheckAnswerBtnClick: () => {

    },

    handleSettingsBtnClick: () => {

    }
  }

  render() {
    return !this.props.active ? null : (
      <div className='viz-control text-center'>
        <Button.Group>
          <Button
            labelPosition='left'
            icon='left chevron'
            content='Back'
            disabled={!this.state.backwardBtnActive}
            onClick={this.eventHandlers.handleBackBtnClick}/>
          <Button
            icon='check'
            content='Check answer'
            onClick={this.eventHandlers.handleCheckAnswerBtnClick}/>
          <Button
            icon='setting'
            content='Settings'
            onClick={this.eventHandlers.handleSettingsBtnClick}/>
          <Button
            icon='level down'
            content='Step into'
            onClick={this.eventHandlers.handleStepIntoBtnClick}/>
          <Button
            labelPosition='right'
            icon='right chevron'
            content='Forward'
            disabled={!this.state.forwardBtnActive}
            onClick={this.eventHandlers.handleForwardBtnClick}/>
        </Button.Group>
      </div>
    );
  }

}
