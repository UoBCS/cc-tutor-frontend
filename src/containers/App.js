import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import MainLayout from 'components/Layouts/MainLayout';
import EmptyLayout from 'components/Layouts/EmptyLayout';
import PortalAccessLayout from 'components/Layouts/PortalAccessLayout';

import Dashboard from './Dashboard';
import Profile from './Profile';
import Homepage from './Homepage';
import NotFound from './NotFound';
import SignIn from './SignIn';
import SignUp from './SignUp';
import VerifyEmail from './VerifyEmail';
import RegexToNFA from './RegexToNFA';
import NfaToDfa from './nfaToDfa/NfaToDfa';
import SyntaxAnalysis from './syntax-analysis/SyntaxAnalysis';
import LL from './syntax-analysis/ll/LL';
import LL1 from './syntax-analysis/ll1/LL1';
import LR from './syntax-analysis/lr/LR';
import LR0 from './syntax-analysis/lr0/LR0';
import SemanticAnalysis from './semantic-analysis/SemanticAnalysis';
import LexicalAnalysis from './lexicalAnalysis/LexicalAnalysis';
import CekMachine from './cekMachine/CekMachine';
import CCAssistant from './cc-assistant/CCAssistant';
import CCAssistantCourse from './cc-assistant/CCAssistantCourse';
import CCAssistantLesson from './cc-assistant/CCAssistantLesson';

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
          <AppRoute exact path="/dashboard/profile" layout={MainLayout} component={Profile} />
          <AppRoute exact path="/dashboard/regex2nfa" layout={MainLayout} component={RegexToNFA} />
          <AppRoute exact path="/dashboard/nfa2dfa" layout={MainLayout} component={NfaToDfa} />
          <AppRoute exact path="/dashboard/syntax-analysis" layout={MainLayout} component={SyntaxAnalysis} />
          <AppRoute exact path="/dashboard/ll" layout={MainLayout} component={LL} />
          <AppRoute exact path="/dashboard/ll1" layout={MainLayout} component={LL1} />
          <AppRoute exact path="/dashboard/lr" layout={MainLayout} component={LR} />
          <AppRoute exact path="/dashboard/lr0" layout={MainLayout} component={LR0} />
          <AppRoute exact path="/dashboard/semantic-analysis" layout={MainLayout} component={SemanticAnalysis} />
          <AppRoute exact path="/dashboard/cek-machine" layout={MainLayout} component={CekMachine} />

          <AppRoute exact path="/dashboard/lexical-analysis" layout={MainLayout} component={LexicalAnalysis} />

          <AppRoute exact path="/cc-assistant" layout={EmptyLayout} component={CCAssistant} />
          <AppRoute exact path="/cc-assistant/courses/:id" layout={EmptyLayout} component={CCAssistantCourse} />
          <AppRoute exact path="/cc-assistant/courses/:cid/lessons/:lid" layout={EmptyLayout} component={CCAssistantLesson} />

          <AppRoute exact path="*" layout={EmptyLayout} component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
