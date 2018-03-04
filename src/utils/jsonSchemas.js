import automata from 'utils/automata';

export const jsonSchemas = {};

const nfaStateTransformer = function (value) {
  return automata.search(this.state.nfa, parseInt(value));
};

const dfaStateTransformer = function (value) {
  return automata.search(this.state.dfa, parseInt(value));
};

const dfaStateSchema = {
  id: {
    type: 'number',
    title: 'State ID'
  },
  final: {
    type: 'boolean',
    title: 'Is final?',
    default: false
  },
  data: { type: 'string' },
  states: {
    title: 'NFA states',
    type: 'array',
    items: { type: 'number' },
    transform: function (values) {
      return values.map(value => nfaStateTransformer.call(this, value));
    }
  }
};

const transitionCharacterSchema = {
  title: 'Transition character',
  type: 'string'
};

jsonSchemas.applyTransformer = function (schema, res) {
  if (schema.properties) {
    Object.keys(schema.properties).forEach(key => {
      res[key] = jsonSchemas.applyTransformer.call(this, schema.properties[key], res[key]);
    });
  }

  if (schema.items && schema.items.properties) {
    for (const val of res) {
      Object.keys(schema.items.properties).forEach(key => {
        val[key] = jsonSchemas.applyTransformer.call(this, schema.items.properties[key], val[key]);
      });
    }
  }

  if (schema.transform) {
    return schema.transform.call(this, res);
  } else {
    return res;
  }
  /*const prop = schema.properties || (schema.items && schema.items.properties);

  if (prop) {
    Object.keys(prop).forEach(key => {
      if (prop[key].transform) {
        res[key] = prop[key].transform.call(this, res[key]);
      }

      jsonSchemas.applyTransformer(prop[key], res[key]);
    });
  }*/
};

jsonSchemas.nfa_to_dfa = {};

jsonSchemas.nfa_to_dfa.highlight_initial_nfa_state = {
  title: 'Highlight initial NFA state',
  type: 'object',
  properties: {
    label: { type: 'string' },
    data: {
      title: 'Data',
      type: 'object',
      properties: {
        state: {
          title: 'Initial state',
          type: 'number',
          transform: nfaStateTransformer
        }
      }
    }
  }
};

jsonSchemas.nfa_to_dfa.initial_state_epsilon_closure = {
  title: 'Initial state epsilon closure',
  type: 'object',
  properties: {
    label: { type: 'string' },
    data: {
      title: 'Data',
      type: 'object',
      properties: {
        initial: {
          title: 'Initial NFA state',
          type: 'number',
          transform: nfaStateTransformer
        },
        reachable_states: {
          title: 'Reachable states',
          type: 'array',
          items: { type: 'number' },
          transform: function (values) {
            return values.map(value => nfaStateTransformer.call(this, value));
          }
        }
      }
    }
  }
};

jsonSchemas.nfa_to_dfa.initial_dfa_state = {
  title: 'Initial DFA state',
  type: 'object',
  properties: {
    label: { type: 'string' },
    data: {
      title: 'Data',
      type: 'object',
      properties: dfaStateSchema
    }
  }
};

jsonSchemas.nfa_to_dfa.possible_inputs = {
  title: 'Possible inputs',
  type: 'object',
  properties: {
    label: { type: 'string' },
    data: {
      title: 'Data',
      type: 'object',
      properties: {
        possible_inputs: {
          title: 'Possible inputs',
          type: 'array',
          items: { type: 'string' }
        },
        transitions: {
          title: 'NFA transitions corresponding to the possible inputs',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              src: {
                title: 'Source NFA state',
                type: 'number',
                transform: nfaStateTransformer
              },
              char: transitionCharacterSchema,
              dest: {
                title: 'Destination NFA states',
                type: 'array',
                items: { type: 'number' },
                transform: function (values) {
                  return values.map(value => nfaStateTransformer.call(this, value));
                }
              }
            }
          }
        },
        dfa_state_contents: {
          title: 'DFA state contents',
          type: 'array',
          items: { type: 'number' }
        }
      }
    }
  }
};

jsonSchemas.nfa_to_dfa.move_states = {
  title: 'Move states',
  type: 'object',
  properties: {
    label: { type: 'string' },
    data: {
      title: 'Data',
      type: 'object',
      properties: {
        state: {
          title: 'Source NFA state',
          type: 'number',
          transform: nfaStateTransformer
        },
        char: transitionCharacterSchema,
        connected_states: {
          title: 'Connected NFA states',
          type: 'array',
          items: { type: 'number' },
          transform: function (values) {
            return values.map(value => nfaStateTransformer.call(this, value));
          }
        }
      }
    }
  }
};

jsonSchemas.nfa_to_dfa.epsilon_closure = {
  title: 'Epsilon closure',
  type: 'object',
  properties: {
    label: { type: 'string' },
    data: {
      title: 'Data',
      type: 'object',
      properties: {
        input: {
          title: 'Input NFA states',
          type: 'array',
          items: { type: 'number' },
          transform: function (values) {
            return values.map(value => nfaStateTransformer.call(this, value));
          }
        },
        output: {
          title: 'Output NFA states',
          type: 'array',
          items: { type: 'number' },
          transform: function (values) {
            return values.map(value => nfaStateTransformer.call(this, value));
          }
        }
      }
    }
  }
};

jsonSchemas.nfa_to_dfa.new_dfa_transition = {
  title: 'New DFA transition',
  type: 'object',
  properties: {
    label: { type: 'string' },
    data: {
      title: 'Data',
      type: 'object',
      properties: {
        src: {
          title: 'Source NFA state',
          type: 'number',
          transform: nfaStateTransformer
        },
        char: transitionCharacterSchema,
        dest: dfaStateSchema
      }
    }
  }
};

/**
 * UI schemas
 */
export const uiSchemas = {};
const hidden = {'ui:widget': 'hidden'};

uiSchemas.nfa_to_dfa = {};
uiSchemas.nfa_to_dfa.highlight_initial_nfa_state = { label: hidden };
uiSchemas.nfa_to_dfa.initial_state_epsilon_closure = { label: hidden };
uiSchemas.nfa_to_dfa.initial_dfa_state = { label: hidden, data: { data: hidden } };
uiSchemas.nfa_to_dfa.possible_inputs = { label: hidden };
uiSchemas.nfa_to_dfa.move_states = { label: hidden };
uiSchemas.nfa_to_dfa.epsilon_closure = { label: hidden };

/**
 * Form data
 */
export const formData = {};

formData.nfa_to_dfa = {};
formData.nfa_to_dfa.highlight_initial_nfa_state = { label: 'highlight_initial_nfa_state' };
formData.nfa_to_dfa.initial_state_epsilon_closure = { label: 'initial_state_epsilon_closure' };
formData.nfa_to_dfa.initial_dfa_state = { label: 'initial_dfa_state', data: { data: undefined } };
formData.nfa_to_dfa.possible_inputs = { label: 'possible_inputs' };
formData.nfa_to_dfa.move_states = { label: 'move_states' };
formData.nfa_to_dfa.epsilon_closure = { label: 'epsilon_closure' };

