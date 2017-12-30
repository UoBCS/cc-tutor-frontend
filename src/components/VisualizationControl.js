import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import objectPath from 'object-path';

class VisualizationControl extends Component {

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

    updateIndex: (direction = 1) => {
      let breakpointsObj = this.props.breakpoint;
      breakpointsObj.indexStack[breakpointsObj.indexStack.length - 1]++;
      this.props.updateState({ breakpointsObj });
    }
  }

  eventHandlers = {
    handleForwardBtnClick: () => {
      let path = this.breakpoint.getPath();
      let breakpoint = objectPath.get(this.props.breakpoint.data, path);
      console.log(breakpoint);

      this.props.visualizeBreakpoint(breakpoint);

      this.breakpoint.updateIndex();
    },

    handleBackBtnClick: () => {

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
      <div className='visualization-control text-center'>
        <Button.Group>
          <Button
            labelPosition='left'
            icon='left chevron'
            content='Back'
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
            onClick={this.eventHandlers.handleForwardBtnClick}/>
        </Button.Group>
      </div>
    );
  }

}

export default VisualizationControl;
