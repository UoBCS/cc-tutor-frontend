import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

import './VisualizationControl.css';

export default class VisualizationControl extends Component {

  breakpoint = {
    getCurrent: () => this.props.breakpoint.data[this.props.breakpoint.index],

    getNext: () => this.props.breakpoint.data[this.props.breakpoint.index + 1],

    getIndex: () => this.props.breakpoint.index,

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
      });
    },

    handleBackBtnClick: () => {
      const breakpoint = this.breakpoint.getCurrent();

      this.breakpoint.updateIndex(-1, () => {
        if (breakpoint !== undefined) {
          this.props.visualizeBreakpointBackward(breakpoint);
        }
      });
    },

    handleSettingsBtnClick: () => {

    }
  }

  render() {
    const checkAnswerBtn = this.props.checkAnswerHandler === undefined ? null :
      <Button
        icon='check'
        content='Check answer'
        disabled={!this.props.active}
        onClick={this.props.checkAnswerHandler}/>;

    const addBreakpointBtn = this.props.addBreakpointHandler === undefined ? null :
      <Button
        icon='plus'
        content='Add breakpoint'
        disabled={!this.props.active}
        onClick={this.props.addBreakpointHandler}/>

    return (
      <div
          className='VisualizationControl text-center'
          fixed={this.props.fixed === undefined ? 'true' : this.props.fixed.toString()}>
        <Button.Group className='VisualizationControl_button_group' size='small' secondary>
          <Button
            labelPosition='left'
            icon='left chevron'
            content='Back'
            disabled={this.breakpoint.getIndex() < 0 || !this.props.active}
            onClick={this.eventHandlers.handleBackBtnClick}/>
          {checkAnswerBtn}
          {addBreakpointBtn}
          <Button
            icon='setting'
            content='Settings'
            disabled={!this.props.active}
            onClick={this.eventHandlers.handleSettingsBtnClick}/>
          <Button
            labelPosition='right'
            icon='right chevron'
            content='Forward'
            disabled={this.breakpoint.getNext() === undefined || !this.props.active}
            onClick={this.eventHandlers.handleForwardBtnClick}/>
        </Button.Group>
      </div>
    );
  }

}
