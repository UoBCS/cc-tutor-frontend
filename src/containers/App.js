import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Message, Loader } from 'semantic-ui-react';

import MainLayout from 'components/MainLayout';
import EmptyLayout from 'components/EmptyLayout';
import PortalAccessLayout from 'components/PortalAccessLayout';

import Dashboard from './Dashboard';
import Homepage from './Homepage';
import NotFound from './NotFound';
import SignIn from './SignIn';
import SignUp from './SignUp';
import VerifyEmail from './VerifyEmail';
import RegexToNFA from './RegexToNFA';
import NfaToDfa from './nfaToDfa/NfaToDfa';

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route {...rest} render={props => (
    <Layout>
      <Component {...props} ui={uiObj} uiState={uiState} />
    </Layout>
  )} />
);

const uiState = {
  message: {
    headerContent: '',
    mainContent: '',
    type: ''
  },
  loader: {
    main: false
  }
};

const uiObj = {};

uiObj.message ={
  show: (comp, type, headerContent, mainContent) => {
    let ui = comp.state.ui;
    ui.message.type = type;
    ui.message.headerContent = headerContent;
    ui.message.mainContent = mainContent;

    comp.setState({ ui });
  },

  hide: comp => {
    let ui = comp.state.ui;
    ui.message.type = '';
    ui.message.headerContent = '';
    ui.message.mainContent = '';

    comp.setState({ ui });
  },

  render: comp => {
    let opts = {};
    opts[comp.state.ui.message.type] = undefined; // TODO: fix this

    return comp.state.ui.message.headerContent !== '' ? (
      <Message {...opts}>
        <Message.Header>{comp.state.ui.message.headerContent}</Message.Header>
        <p>{comp.state.ui.message.mainContent}</p>
      </Message>
    ) : null;
  }
};

uiObj.loader = {
  show: (comp, which) => {
    let ui = comp.state.ui;
    ui.loader[which] = true;

    comp.setState({ ui });
  },

  hide: (comp, which) => {
    let ui = comp.state.ui;
    ui.loader[which] = false;

    comp.setState({ ui });
  },

  render: (comp, which) => {
    return comp.state.ui.loader[which] ? <Loader active inline='centered' /> : null;
  }
};

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <AppRoute exact path="/" layout={EmptyLayout} component={Homepage} />
          <AppRoute exact path="/sign-in" layout={PortalAccessLayout} component={SignIn} />
          <AppRoute exact path="/sign-up" layout={PortalAccessLayout} component={SignUp} />
          <AppRoute exact path="/verify-email/:token" layout={EmptyLayout} component={VerifyEmail} />

          <AppRoute exact path="/dashboard" layout={MainLayout} component={Dashboard} />
          <AppRoute exact path="/dashboard/regex2nfa" layout={MainLayout} component={RegexToNFA} />
          <AppRoute exact path="/dashboard/nfa2dfa" layout={MainLayout} component={NfaToDfa} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
