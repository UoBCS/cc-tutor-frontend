import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import MainLayout from 'components/Layouts/MainLayout';
import EmptyLayout from 'components/Layouts/EmptyLayout';
import PortalAccessLayout from 'components/Layouts/PortalAccessLayout';

import Dashboard from './Dashboard';
import ApiDocumentation from './apiDocumentation/ApiDocumentation';
import Profile from './Profile';
import Homepage from './Homepage';
import NotFound from './NotFound';
import SignIn from './SignIn';
import SignUp from './SignUp';
import VerifyEmail from './VerifyEmail';
import ConfirmClassInvitation from './ConfirmClassInvitation';
import RegexToNFA from './regexToNfa/RegexToNFA';
import NfaToDfa from './nfaToDfa/NfaToDfa';
import DfaMinimization from './dfaMinimization/DfaMinimization';
import SyntaxAnalysis from './syntaxAnalysis/SyntaxAnalysis';
import LL from './syntaxAnalysis/ll/LL';
import LL1 from './syntaxAnalysis/ll1/LL1';
import LR from './syntaxAnalysis/lr/LR';
import LR0 from './syntaxAnalysis/lr0/LR0';
import SemanticAnalysis from './semanticAnalysis/SemanticAnalysis';
import LexicalAnalysis from './lexicalAnalysis/LexicalAnalysis';
import CekMachine from './cekMachine/CekMachine';
import Assignments from './assignments/Assignments';
import CreateAssignment from './assignments/CreateAssignment';
import Assignment from './assignments/Assignment';
import AssignmentSubmissions from './assignments/AssignmentSubmissions';
import CCAssistant from './ccAssistant/CCAssistant';
import CCAssistantCourse from './ccAssistant/CCAssistantCourse';
import CCAssistantLesson from './ccAssistant/CCAssistantLesson';

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route {...rest} render={props => (
    <Layout {...props}>
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
          <AppRoute exact path="/students/class-invitation/:token" layout={EmptyLayout} component={ConfirmClassInvitation} />

          <AppRoute exact path="/dashboard" layout={MainLayout} component={Dashboard} />
          <AppRoute exact path="/dashboard/profile" layout={MainLayout} component={Profile} />
          <AppRoute exact path="/dashboard/regex2nfa" layout={MainLayout} component={RegexToNFA} />
          <AppRoute exact path="/dashboard/nfa2dfa" layout={MainLayout} component={NfaToDfa} />
          <AppRoute exact path="/dashboard/dfa-minimization" layout={MainLayout} component={DfaMinimization} />
          <AppRoute exact path="/dashboard/lexical-analysis" layout={MainLayout} component={LexicalAnalysis} />
          <AppRoute exact path="/dashboard/syntax-analysis" layout={MainLayout} component={SyntaxAnalysis} />
          <AppRoute exact path="/dashboard/ll" layout={MainLayout} component={LL} />
          <AppRoute exact path="/dashboard/ll1" layout={MainLayout} component={LL1} />
          <AppRoute exact path="/dashboard/lr" layout={MainLayout} component={LR} />
          <AppRoute exact path="/dashboard/lr0" layout={MainLayout} component={LR0} />
          <AppRoute exact path="/dashboard/semantic-analysis" layout={MainLayout} component={SemanticAnalysis} />
          <AppRoute exact path="/dashboard/cek-machine" layout={MainLayout} component={CekMachine} />

          <AppRoute exact path="/dashboard/assignments" layout={MainLayout} component={Assignments} />
          <AppRoute exact path="/dashboard/assignments/create" layout={MainLayout} component={CreateAssignment} />
          <AppRoute exact path="/dashboard/assignments/:id" layout={MainLayout} component={Assignment} />
          <AppRoute exact path="/dashboard/assignments/:id/submissions" layout={MainLayout} component={AssignmentSubmissions} />

          <AppRoute exact path="/cc-assistant" layout={EmptyLayout} component={CCAssistant} />
          <AppRoute exact path="/cc-assistant/courses/:id" layout={EmptyLayout} component={CCAssistantCourse} />
          <AppRoute exact path="/cc-assistant/courses/:cid/lessons/:lid" layout={EmptyLayout} component={CCAssistantLesson} />

          <AppRoute exact path="/api-documentation" layout={EmptyLayout} component={ApiDocumentation} />

          <AppRoute exact path="*" layout={EmptyLayout} component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
