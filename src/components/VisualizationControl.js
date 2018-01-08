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
    globalLength: 0,
    globalIndex: -1,

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
      const path = this.breakpoint.getPath();
      return objectPath.get(this.props.breakpoint.data, path);
    },

    getIndex: () => {
      return misc.last(this.props.breakpoint.indexStack);
    },

    updateIndex: (direction = 1) => {
      let breakpointsObj = this.props.breakpoint;

      if (direction === 1) {
        breakpointsObj.indexStack[breakpointsObj.indexStack.length - 1]++;
      } else {
        breakpointsObj.indexStack[breakpointsObj.indexStack.length - 1]--;
      }

      this.props.updateState({ breakpointsObj });
    },

    updateGlobalIndex: (direction = 1) => {
      this.breakpoint.globalIndex = this.breakpoint.globalIndex + direction;

      if (this.breakpoint.globalIndex === this.breakpoint.globalLength - 1) {
        this.breakpoint.globalLength++;
      }
    }
  }

  eventHandlers = {
    handleForwardBtnClick: () => {
      const breakpoint = this.breakpoint.getCurrent();

      this.breakpoint.updateGlobalIndex();

      this.props.visualizeBreakpointForward(breakpoint, this.breakpoint.globalIndex);

      this.breakpoint.updateIndex();

      this.setState({
        backwardBtnActive: this.breakpoint.getIndex() > 0,
        forwardBtnActive: this.breakpoint.getCurrent() !== undefined
      });
    },

    handleBackBtnClick: () => {
      this.breakpoint.updateIndex(-1);

      this.breakpoint.updateGlobalIndex(-1);

      const breakpoint = this.breakpoint.getCurrent();

      this.props.visualizeBreakpointBackward(breakpoint, this.breakpoint.globalIndex);

      this.setState({
        backwardBtnActive: this.breakpoint.getIndex() > 0,
        forwardBtnActive: breakpoint !== undefined
      });
    },

    handleStepIntoBtnClick: () => {

    },

    handleSettingsBtnClick: () => {

    }
  }

  render() {
    return (
      <div className='viz-control text-center'>
        <Button.Group>
          <Button
            labelPosition='left'
            icon='left chevron'
            content='Back'
            disabled={!this.state.backwardBtnActive || !this.props.active}
            onClick={this.eventHandlers.handleBackBtnClick}/>
          <Button
            icon='check'
            content='Check answer'
            disabled={!this.props.active}
            onClick={this.props.checkAnswerHandler}/>
          <Button
            icon='setting'
            content='Settings'
            disabled={!this.props.active}
            onClick={this.eventHandlers.handleSettingsBtnClick}/>
          <Button
            icon='level down'
            content='Step into'
            disabled={!this.props.active}
            onClick={this.eventHandlers.handleStepIntoBtnClick}/>
          <Button
            labelPosition='right'
            icon='right chevron'
            content='Forward'
            disabled={!this.state.forwardBtnActive || !this.props.active}
            onClick={this.eventHandlers.handleForwardBtnClick}/>
        </Button.Group>
      </div>
    );
  }

}
