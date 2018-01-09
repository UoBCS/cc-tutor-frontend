import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

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
import LexicalAnalysis from './lexicalAnalysis/LexicalAnalysis';

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route {...rest} render={props => (
    <Layout>
      <Component {...props} />
    </Layout>
  )} />
);

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
          <AppRoute exact path="/dashboard/lexical-analysis" layout={MainLayout} component={LexicalAnalysis} />

          <AppRoute exact path="*" layout={EmptyLayout} component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
