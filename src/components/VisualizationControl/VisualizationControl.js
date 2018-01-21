import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

import './VisualizationControl.css';

export default class VisualizationControl extends Component {

  state = {
    forwardBtnActive: true,
    backwardBtnActive: false
  }

  breakpoint = {
    getCurrent: () => {
      return this.props.breakpoint.data[this.props.breakpoint.index];
    },

    getNext: () => {
      return this.props.breakpoint.data[this.props.breakpoint.index + 1];
    },

    getIndex: () => {
      return this.props.breakpoint.index;
    },

    updateIndex: (direction = 1, cb = null) => {
      let breakpointsObj = this.props.breakpoint;
      breakpointsObj.index = breakpointsObj.index + direction;

      this.props.updateState({ breakpointsObj }, cb);
    }
  }

  eventHandlers = {
    handleForwardBtnClick: () => {
      this.breakpoint.updateIndex(1, () => {
        const breakpoint = this.breakpoint.getCurrent();

        if (breakpoint !== undefined) {
          this.props.visualizeBreakpointForward(breakpoint);
        }

        this.setState({
          forwardBtnActive: this.breakpoint.getNext() !== undefined,
          backwardBtnActive: this.breakpoint.getIndex() >= 0
        });
      });
    },

    handleBackBtnClick: () => {
      const breakpoint = this.breakpoint.getCurrent();

      this.breakpoint.updateIndex(-1, () => {
        if (breakpoint !== undefined) {
          this.props.visualizeBreakpointBackward(breakpoint);
        }

        this.setState({
          forwardBtnActive: breakpoint !== undefined,
          backwardBtnActive: this.breakpoint.getIndex() >= 0
        });
      });
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
