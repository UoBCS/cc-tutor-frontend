import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Grid, Message, Segment, Menu, Input, Label } from 'semantic-ui-react';

class MainLayout extends Component {
  state = { activeItem: 'dashboard' }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  }

  render() {
    const { activeItem } = this.state || {};
    const pref = '/dashboard';

    return (
      <div>
        <div className='ui large inverted vertical left fixed menu'
          style={{
            position: 'fixed',
            top: 0, left: 0, bottom: 0,
            width: 250,
            background: 'rgb(27, 28, 29)',
            overflowY: 'scroll'
          }}>
          <Menu.Item name='dashboard' active={activeItem === 'dashboard'} as={Link} to={pref} onClick={this.handleItemClick}>
            Dashboard
          </Menu.Item>

          <Menu.Item>
            <Menu.Header>Compiler</Menu.Header>
            <Menu.Menu>
              <Menu.Item name='lexicalAnalysis' active={activeItem === 'lexicalAnalysis'} onClick={this.handleItemClick}/>
              <Menu.Item name='syntaxAnalysis' active={activeItem === 'syntaxAnalysis'} onClick={this.handleItemClick}/>
              <Menu.Item name='semanticAnalysis' active={activeItem === 'semanticAnalysis'} onClick={this.handleItemClick}/>
              <Menu.Item name='garbageCollection' active={activeItem === 'garbageCollection'} onClick={this.handleItemClick}/>
              <Menu.Item name='CEKMachine' active={activeItem === 'CEKMachine'} onClick={this.handleItemClick}/>
            </Menu.Menu>
          </Menu.Item>

          <Menu.Item>
            <Menu.Header>Algorithms</Menu.Header>
            <Menu.Menu>
              <Menu.Item name='regularExpressionToNFA' active={activeItem === 'regularExpressionToNFA'} as={Link} to={`${pref}/regex2nfa`} onClick={this.handleItemClick}/>
              <Menu.Item name='NFAToDFA' active={activeItem === 'NFAToDFA'} as={Link} to={`${pref}/nfa2dfa`} onClick={this.handleItemClick}/>
              <Menu.Item name='DFAMinimization' active={activeItem === 'DFAMinimization'} onClick={this.handleItemClick}/>
              <Menu.Item name='LLParsing' active={activeItem === 'LLParsing'} onClick={this.handleItemClick}/>
              <Menu.Item name='LRParsing' active={activeItem === 'LRParsing'} onClick={this.handleItemClick}/>
              <Menu.Item name='markAndSweep' active={activeItem === 'markAndSweep'} onClick={this.handleItemClick}/>
              <Menu.Item name='markSweepCompact' active={activeItem === 'markSweepCompact'} onClick={this.handleItemClick}/>
              <Menu.Item name='markAndCopy' active={activeItem === 'markAndCopy'} onClick={this.handleItemClick}/>
            </Menu.Menu>
          </Menu.Item>

          <Menu.Item name='ccAssistant' active={activeItem === 'ccAssistant'} onClick={this.handleItemClick}>
            CC Assistant
          </Menu.Item>

          <Menu.Item name='assignments' active={activeItem === 'assignments'} onClick={this.handleItemClick}>
            Assignments
          </Menu.Item>

          <Menu.Item name='exercises' active={activeItem === 'exercises'} onClick={this.handleItemClick}>
            Exercises
          </Menu.Item>

          <Menu.Item name='profile' active={activeItem === 'profile'} onClick={this.handleItemClick}>
            Profile
          </Menu.Item>

          <Menu.Item name='logout' onClick={this.handleItemClick}>
            Logout
          </Menu.Item>
        </div>
        <div style={{ marginLeft: 250, minWidth: 550 }}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default MainLayout;
