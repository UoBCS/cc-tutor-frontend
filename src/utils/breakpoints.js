import React from 'react';
import { Button, List } from 'semantic-ui-react';
import { For } from 'react-extras';
import Form from 'react-jsonschema-form';
import internal from 'containers/nfaToDfa/internal';
import _ from 'lodash';
import clone from 'clone';
import { lensPath, view, set } from 'ramda';
import automata from 'utils/automata';
import ui from 'utils/ui';
import api from 'api';
import { jsonSchemas, uiSchemas, formData } from './jsonSchemas';

const breakpoints = {};

breakpoints.initializers = {
  setAlgorithm: algo => {
    breakpoints.ALGORITHM = algo;
  }
}

breakpoints.eventHandlers = {
  visualizeForward: function (breakpoint) {
    const data = breakpoint.data;
    const index = this.state.contents.index;
    internal.forward[_.camelCase(breakpoint.label)].call(this, { data, index });
  },

  visualizeBackward: function (breakpoint) {
    const data = breakpoint.data;
    const index = this.state.contents.index;
    internal.backward[_.camelCase(breakpoint.label)].call(this, { data, index });
  },

  showActionChooser: function () {
    ui.obj.modal.hide(this);
    ui.obj.modal.show(
      this,
      'Choose next action',
      breakpoints.renderers.chooseBreakpointContent.bind(this)()
    );
  },

  choose: function (index) {
    return function () {
      ui.obj.modal.hide(this);
      ui.obj.modal.show(
        this,
        'Choose arguments',
        breakpoints.renderers.chooseBreakpointArgumentsContent.bind(this)(index),
        breakpoints.renderers.chooseBreakpointArgumentsFooter.bind(this)()
      );
    }
  },

  add: function (data) {
    const result = clone(data.formData);
    const dataSchema = clone(data.schema);

    jsonSchemas.applyTransformer.call(this, dataSchema, result);

    const contents = this.state.contents;
    contents.data.push(result);

    this.setState({ contents });
  }
};

breakpoints.renderers = {
  chooseBreakpointContent: function () {
    const schema = jsonSchemas[breakpoints.ALGORITHM];
    const breakpointTypes = Object.keys(schema);

    return (
      <List divided relaxed>
        <For of={breakpointTypes} render={(breakpoint, index) => (
          <List.Item key={index}>
            <List.Content>
              <List.Header as='a' onClick={breakpoints.eventHandlers.choose(index).bind(this)}>
                {schema[breakpoint].title}
              </List.Header>
            </List.Content>
          </List.Item>
        )}/>
      </List>
    )
  },

  chooseBreakpointArgumentsContent: function (index) {
    const schema = jsonSchemas[breakpoints.ALGORITHM];
    const uiSchema = uiSchemas[breakpoints.ALGORITHM];
    const fData = formData[breakpoints.ALGORITHM];

    const breakpointTypes = Object.keys(schema);
    const label = breakpointTypes[index];

    return (
      <Form
        schema={schema[label]}
        uiSchema={uiSchema[label]}
        formData={fData[label]}
        onSubmit={breakpoints.eventHandlers.add.bind(this)} />
    );
  },

  chooseBreakpointArgumentsFooter: function () {
    return (
      <div>
        <Button basic onClick={breakpoints.eventHandlers.showActionChooser.bind(this)}>Back</Button>
      </div>
    );
  }
};

export default breakpoints;
