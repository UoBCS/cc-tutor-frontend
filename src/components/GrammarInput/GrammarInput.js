import React, { Component } from 'react';
import { Button, Header, Menu, Grid, Icon, Form } from 'semantic-ui-react';
import { WithContext as ReactTags } from 'react-tag-input';
import 'components/ReactTags.css';

export default class GrammarInput extends Component {

  state = {
    productions: [
      ['s', [{id: 1, text: 'Test'}]]
    ],
    startSymbol: ''
  }

  eventHandlers = {
    handleGrammarEntityDeletion: prodIdx => {
      return i => {
        let productions = this.state.productions;
        productions[prodIdx][1].splice(i, 1);
        this.setState({ productions });
      };
    },

    handleGrammarEntityAddition: prodIdx => {
      return tag => {
        let productions = this.state.productions;
        productions[prodIdx][1].push({
            id: productions[prodIdx][1].length + 1,
            text: tag
        });
        this.setState({ productions });
      };
    },

    handleGrammarEntityDrag: prodIdx => {
      return (tag, currPos, newPos) => {
        let productions = this.state.productions;

        productions[prodIdx][1].splice(currPos, 1);
        productions[prodIdx][1].splice(newPos, 0, tag);

        this.setState({ productions });
      }
    },

    handleProductionAddition: () => {
      let productions = this.state.productions;
      productions.push(['', []]);
      this.setState({ productions });
    },

    handleLhsChange: event => {
      const target = event.target;
      let productions = this.state.productions;
      productions[parseInt(target.name)][0] = target.value;
      this.setState({ productions });
    },
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
          {this.state.productions.map((production, i) => (
            <div key={i}>
              <Form.Input
                name={'' + i}
                className='monospace-input'
                placeholder='LHS'
                value={production[0]}
                onChange={this.eventHandlers.handleLhsChange}/>
              <ReactTags
                tags={production[1]}
                handleDelete={this.eventHandlers.handleGrammarEntityDeletion(i)}
                handleAddition={this.eventHandlers.handleGrammarEntityAddition(i)}
                handleDrag={this.eventHandlers.handleGrammarEntityDrag(i)} />
            </div>
          ))}
        </Form.Group>

        <Button animated='vertical' onClick={this.eventHandlers.handleProductionAddition}>
          <Button.Content hidden>RHS</Button.Content>
          <Button.Content visible>
            <Icon name='plus' />
          </Button.Content>
        </Button>


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
