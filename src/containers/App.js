import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import MainLayout from '../components/MainLayout';
import EmptyLayout from '../components/EmptyLayout';
import PortalAccessLayout from '../components/PortalAccessLayout';

import Dashboard from '../containers/Dashboard';
import Homepage from '../containers/Homepage';
import NotFound from '../containers/NotFound';
import SignIn from '../containers/SignIn';
import SignUp from '../containers/SignUp';
import VerifyEmail from '../containers/VerifyEmail';

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
          <AppRoute exact path="/verify-email/:token" layout={EmptyLayout} component={VerifyEmail} />
          <AppRoute exact path="/sign-in" layout={PortalAccessLayout} component={SignIn} />
          <AppRoute exact path="/sign-up" layout={PortalAccessLayout} component={SignUp} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
