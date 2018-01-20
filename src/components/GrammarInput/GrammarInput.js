import React, { Component } from 'react';
import { Button, Header, Menu, Grid, Icon, Form } from 'semantic-ui-react';
import { WithContext as ReactTags } from 'react-tag-input';
import 'components/ReactTags.css';

export default class GrammarInput extends Component {

  state = {
    productions: {
      's': [{id: 1, text: 'Test'}]
    },
    startSymbol: ''
  }

  eventHandlers = {
    handleGrammarEntityDeletion: lhs => {
      return i => {
        let productions = this.state.productions;
        productions[lhs].splice(i, 1);
        this.setState({ productions });
      };
    },

    handleGrammarEntityAddition: lhs => {
      return tag => {
        let productions = this.state.productions;
        productions[lhs].push({
            id: productions[lhs].length + 1,
            text: tag
        });
        this.setState({ productions });
      };
    },

    handleGrammarEntityDrag: lhs => {
      return (tag, currPos, newPos) => {
        let productions = this.state.productions;

        productions[lhs].splice(currPos, 1);
        productions[lhs].splice(newPos, 0, tag);

        this.setState({ productions });
      }
    }
  }

  getData = () => {
    return {
      productions: this.state.productions,
      startSymbol: this.state.startSymbol
    }
  }

  render() {
    return (
      <div>
        <Form.Group>
          {Object.keys(this.state.productions).map((lhs, i) => (
            <div key={i}>
              <Form.Input className='monospace-input' placeholder='LHS' value={lhs} />
              <ReactTags
                tags={this.state.productions[lhs]}
                handleDelete={this.eventHandlers.handleGrammarEntityDeletion(lhs)}
                handleAddition={this.eventHandlers.handleGrammarEntityAddition(lhs)}
                handleDrag={this.eventHandlers.handleGrammarEntityDrag(lhs)} />
            </div>
          ))}

          <Button animated='vertical'>
            <Button.Content hidden>RHS</Button.Content>
            <Button.Content visible>
              <Icon name='plus' />
            </Button.Content>
          </Button>
        </Form.Group>

        <Button animated='vertical'>
          <Button.Content hidden>Rule</Button.Content>
          <Button.Content visible>
            <Icon name='plus' />
          </Button.Content>
        </Button>
      </div>
    );
  }

}
