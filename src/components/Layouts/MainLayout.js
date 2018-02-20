import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Grid, Icon, Menu } from 'semantic-ui-react';
import './MainLayout.css';

export default class MainLayout extends Component {
  state = {
    activeItem: 'dashboard',
    sidebarClosed: false
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  }

  eventHandlers = {
    toggleSidebarCloseHandler: () => {
      this.setState({ sidebarClosed: !this.state.sidebarClosed });
    }
  }

  render() {
    const { activeItem } = this.state || {};
    const pref = '/dashboard';

    return (
      <div>
        <Header as='h1' style={{
          margin: '24px 60px',
          paddingBottom: 15,
          borderBottom: '1px solid #cecece',
          color: '#425164'
        }}>
          <Icon name='lab'/>
          <Header.Content>
            CC Tutor
          </Header.Content>
        </Header>

        <Grid style={{ padding: '0 60px' }}>
          <Grid.Column width={this.state.sidebarClosed ? 1 : 3} style={{ maxWidth: 400 }}>
            <Menu secondary fluid vertical size='massive' icon={this.state.sidebarClosed}>
              <Menu.Item name='menu' as='a' onClick={this.eventHandlers.toggleSidebarCloseHandler}>
                <Icon name='bars' />
                {this.state.sidebarClosed ? null : 'Menu'}
              </Menu.Item>

              <div style={{ display: this.state.sidebarClosed ? 'none' : 'block' }}>
                <Menu.Item name='dashboard' active={activeItem === 'dashboard'} as={Link} to={pref} onClick={this.handleItemClick}>
                  Dashboard
                </Menu.Item>

                <Menu.Item>
                  <Menu.Header>Compiler</Menu.Header>
                  <Menu.Menu>
                    <Menu.Item name='lexicalAnalysis' active={activeItem === 'lexicalAnalysis'} as={Link} to={`${pref}/lexical-analysis`} onClick={this.handleItemClick}/>
                    <Menu.Item name='syntaxAnalysis' active={activeItem === 'syntaxAnalysis'} as={Link} to={`${pref}/syntax-analysis`} onClick={this.handleItemClick}/>
                    <Menu.Item name='semanticAnalysis' active={activeItem === 'semanticAnalysis'} as={Link} to={`${pref}/semantic-analysis`} onClick={this.handleItemClick}/>
                    <Menu.Item name='garbageCollection' active={activeItem === 'garbageCollection'} onClick={this.handleItemClick}/>
                    <Menu.Item name='CEKMachine' active={activeItem === 'CEKMachine'} as={Link} to={`${pref}/cek-machine`} onClick={this.handleItemClick}/>
                  </Menu.Menu>
                </Menu.Item>

                <Menu.Item>
                  <Menu.Header>Algorithms</Menu.Header>
                  <Menu.Menu>
                    <Menu.Item name='regularExpressionToNFA' active={activeItem === 'regularExpressionToNFA'} as={Link} to={`${pref}/regex2nfa`} onClick={this.handleItemClick}/>
                    <Menu.Item name='NFAToDFA' active={activeItem === 'NFAToDFA'} as={Link} to={`${pref}/nfa2dfa`} onClick={this.handleItemClick}/>
                    <Menu.Item name='DFAMinimization' active={activeItem === 'DFAMinimization'} as={Link} to={`${pref}/dfa-minimization`} onClick={this.handleItemClick}/>
                    <Menu.Item name='LLParsing' active={activeItem === 'LLParsing'} as={Link} to={`${pref}/ll`} onClick={this.handleItemClick}/>
                    <Menu.Item name='LRParsing' active={activeItem === 'LRParsing'} as={Link} to={`${pref}/lr`} onClick={this.handleItemClick}/>
                    <Menu.Item name='LL(1)Parsing' active={activeItem === 'LL(1)Parsing'} as={Link} to={`${pref}/ll1`} onClick={this.handleItemClick}/>
                    <Menu.Item name='LR(0)Parsing' active={activeItem === 'LR(0)Parsing'} as={Link} to={`${pref}/lr0`} onClick={this.handleItemClick}/>
                    <Menu.Item name='markAndSweep' active={activeItem === 'markAndSweep'} onClick={this.handleItemClick}/>
                    <Menu.Item name='markSweepCompact' active={activeItem === 'markSweepCompact'} onClick={this.handleItemClick}/>
                    <Menu.Item name='markAndCopy' active={activeItem === 'markAndCopy'} onClick={this.handleItemClick}/>
                  </Menu.Menu>
                </Menu.Item>

                <Menu.Item name='ccAssistant' active={activeItem === 'ccAssistant'} onClick={this.handleItemClick} as={Link} to={'/cc-assistant'}>
                  CC Assistant
                </Menu.Item>

                <Menu.Item name='assignments' active={activeItem === 'assignments'} onClick={this.handleItemClick}>
                  Assignments
                </Menu.Item>

                <Menu.Item name='exercises' active={activeItem === 'exercises'} onClick={this.handleItemClick}>
                  Exercises
                </Menu.Item>

                <Menu.Item name='profile' active={activeItem === 'profile'} as={Link} to={`${pref}/profile`} onClick={this.handleItemClick}>
                  Profile
                </Menu.Item>

                <Menu.Item name='logout' onClick={this.handleItemClick}>
                  Logout
                </Menu.Item>
              </div>
            </Menu>
          </Grid.Column>

          <Grid.Column width={this.state.sidebarClosed ? 15 : 13}>
            {this.props.children}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
