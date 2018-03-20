import React, { Component } from 'react';
import { Button, Popup } from 'semantic-ui-react';

import './VisualizationControl.css';

export default class VisualizationControl extends Component {

  breakpoint = {
    getCurrent: () => this.props.breakpoint.data ? this.props.breakpoint.data[this.props.breakpoint.index] : undefined,

    getNext: () => this.props.breakpoint.data ? this.props.breakpoint.data[this.props.breakpoint.index + 1] : undefined,

    getIndex: () => this.props.breakpoint.index,

    updateIndex: (direction = 1, cb = null) => {
      let breakpointsObj = this.props.breakpoint;
      breakpointsObj.index = breakpointsObj.index + direction;

      this.props.updateState({ breakpointsObj }, cb);
    },

    startIndex: (cb = null) => {
      let breakpointsObj = this.props.breakpoint;
      breakpointsObj.index = -1;

      this.props.updateState({ breakpointsObj }, cb);
    },

    forAll: (cb = null) => {
      if (!this.props.breakpoint.data) {
        return;
      }

      this.props.breakpoint.data.forEach(b => {
        this.props.visualizeBreakpointForward(b, cb);
      });
    }
  }

  eventHandlers = {
    forward: (cb = null) => {
      this.breakpoint.updateIndex(1, () => {
        const breakpoint = this.breakpoint.getCurrent();

        if (breakpoint !== undefined) {
          this.props.visualizeBreakpointForward(breakpoint, cb);
        }
      });
    },

    back: (cb = null) => {
      const breakpoint = this.breakpoint.getCurrent();

      this.breakpoint.updateIndex(-1, () => {
        if (breakpoint !== undefined) {
          this.props.visualizeBreakpointBackward(breakpoint, cb);
        }
      });
    },

    saveClick: () => {
      if (this.props.saveVisualizationHandler) {
        this.props.saveVisualizationHandler();
      }
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
            onClick={this.eventHandlers.back}/>
          {checkAnswerBtn}
          {addBreakpointBtn}
          <Popup
            trigger={
              <Button
                icon='download'
                content='Save'
                disabled={!this.props.active}
                onClick={this.eventHandlers.saveClick}/>
            }
            content='This operation may take minutes to complete.'
          />
          <Button
            labelPosition='right'
            icon='right chevron'
            content='Forward'
            disabled={this.breakpoint.getNext() === undefined || !this.props.active}
            onClick={this.eventHandlers.forward}/>
        </Button.Group>
      </div>
    );
  }

}
