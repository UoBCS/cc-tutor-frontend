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
    //globalLength: 0,
    //globalIndex: -1,

    getCurrent: () => {
      //const path = this.breakpoint.getPath();
      return this.props.breakpoint.data[this.props.breakpoint.index]; //objectPath.get(this.props.breakpoint.data, path);
    },

    getIndex: () => {
      return this.props.breakpoint.index; //misc.last(this.props.breakpoint.indexStack);
    },

    updateIndex: (direction = 1, cb = null) => {
      let breakpointsObj = this.props.breakpoint;
      breakpointsObj.index = breakpointsObj.index + direction;

      /*if (direction === 1) {
        breakpointsObj.indexStack[breakpointsObj.indexStack.length - 1]++;
      } else {
        breakpointsObj.indexStack[breakpointsObj.indexStack.length - 1]--;
      }*/

      this.props.updateState({ breakpointsObj }, cb);
    },

    /*updateGlobalIndex: (direction = 1) => {
      this.breakpoint.globalIndex = this.breakpoint.globalIndex + direction;

      if (this.breakpoint.globalIndex === this.breakpoint.globalLength - 1) {
        this.breakpoint.globalLength++;
      }
    }*/
  }

  eventHandlers = {
    handleForwardBtnClick: () => {
      const breakpoint = this.breakpoint.getCurrent();

      //this.breakpoint.updateGlobalIndex();
      this.props.visualizeBreakpointForward(breakpoint);

      this.breakpoint.updateIndex(1, () => {
        this.setState({
          backwardBtnActive: this.breakpoint.getIndex() > 0,
          forwardBtnActive: this.breakpoint.getCurrent() !== undefined
        });
      });
    },

    handleBackBtnClick: () => {
      this.breakpoint.updateIndex(-1, () => {
        //this.breakpoint.updateGlobalIndex(-1);

        const breakpoint = this.breakpoint.getCurrent();

        this.props.visualizeBreakpointBackward(breakpoint);

        this.setState({
          backwardBtnActive: this.breakpoint.getIndex() > 0,
          forwardBtnActive: breakpoint !== undefined
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
