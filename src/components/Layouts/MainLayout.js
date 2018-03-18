import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Grid, Icon, Menu } from 'semantic-ui-react';
import auth from 'utils/auth';
import storage from 'utils/storage';
import api from 'api';
import './MainLayout.css';

export default class MainLayout extends Component {
  state = {
    sidebarClosed: false,
    user: null
  }

  updaters = {
    updateData: () => {
      if (!api.updateAuthToken()) {
        this.props.history.push('/sign-in');
      }

      auth.updateUserData();
    }
  }

  eventHandlers = {
    toggleSidebar: () => {
      this.setState({ sidebarClosed: !this.state.sidebarClosed });
    },

    logout: () => {
      api.logout()
        .then(res => {
          this.props.history.push('/sign-in');
        })
        .catch(err => {
          this.props.history.push('/sign-in');
        });
    }
  }

  componentWillMount() {
    this.updaters.updateData();
  }

  componentDidUpdate() {
    this.updaters.updateData();
  }

  render() {
    const url = window.location.pathname;
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
            <Link as='a' to='/' style={{ color: '#62717E' }}>CC Tutor</Link>
          </Header.Content>
        </Header>

        <Grid style={{ padding: '0 60px' }}>
          <Grid.Column width={this.state.sidebarClosed ? 1 : 3} style={{ maxWidth: 400 }}>
            <Menu secondary fluid vertical size='massive' icon={this.state.sidebarClosed}>
              <Menu.Item name='menu' as='a' onClick={this.eventHandlers.toggleSidebar}>
                <Icon name='bars' />
                {this.state.sidebarClosed ? null : 'Menu'}
              </Menu.Item>

              <div style={{ display: this.state.sidebarClosed ? 'none' : 'block' }}>
                <Menu.Item name='dashboard' active={url === pref} as={Link} to={pref} >
                  Dashboard
                </Menu.Item>

                <Menu.Item>
                  <Menu.Header>Compiler</Menu.Header>
                  <Menu.Menu>
                    <Menu.Item name='lexicalAnalysis' active={url === `${pref}/lexical-analysis`} as={Link} to={`${pref}/lexical-analysis`} />
                    <Menu.Item name='syntaxAnalysis' active={url === `${pref}/syntax-analysis`} as={Link} to={`${pref}/syntax-analysis`} />
                    <Menu.Item name='semanticAnalysis' active={url === `${pref}/semantic-analysis`} as={Link} to={`${pref}/semantic-analysis`} />
                    <Menu.Item name='CEKMachine' active={url === `${pref}/cek-machine`} as={Link} to={`${pref}/cek-machine`} />
                  </Menu.Menu>
                </Menu.Item>

                <Menu.Item>
                  <Menu.Header>Algorithms</Menu.Header>
                  <Menu.Menu>
                    <Menu.Item name='regularExpressionToNFA' active={url === `${pref}/regex2nfa`} as={Link} to={`${pref}/regex2nfa`} />
                    <Menu.Item name='NFAToDFA' active={url === `${pref}/nfa2dfa`} as={Link} to={`${pref}/nfa2dfa`} />
                    <Menu.Item name='DFAMinimization' active={url === `${pref}/dfa-minimization`} as={Link} to={`${pref}/dfa-minimization`} />
                    <Menu.Item name='LLParsing' active={url === `${pref}/ll`} as={Link} to={`${pref}/ll`} />
                    <Menu.Item name='LRParsing' active={url === `${pref}/lr`} as={Link} to={`${pref}/lr`} />
                    <Menu.Item name='LL(1)Parsing' active={url === `${pref}/ll1`} as={Link} to={`${pref}/ll1`} />
                    <Menu.Item name='LR(0)Parsing' active={url === `${pref}/lr0`} as={Link} to={`${pref}/lr0`} />
                  </Menu.Menu>
                </Menu.Item>

                <Menu.Item name='ccAssistant' active={url === '/cc-assistant'}  as={Link} to={'/cc-assistant'}>
                  CC Assistant
                </Menu.Item>

                <Menu.Item name='assignments' active={url.startsWith(`${pref}/assignments`)}  as={Link} to={`${pref}/assignments`}>
                  Assignments
                </Menu.Item>

                <Menu.Item name='profile' active={url === `${pref}/profile`} as={Link} to={`${pref}/profile`} >
                  Profile
                </Menu.Item>

                <Menu.Item name='logout' onClick={this.eventHandlers.logout}>
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
