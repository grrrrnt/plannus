import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import NavBar from "../navigation";
import Home from "../home/Home";
import Generate from "../generate";
import Compare from "../compare/Compare";
import Account from "../account/Account";
import { Login, Register, withAuthentication } from "../authentication";

import SelectModules from '../generate/SelectModules';

import * as ROUTES from '../../util/Routes';

class App extends Component {
  render() {
    return (
      <div className="App" >
        <NavBar></NavBar>
        <Switch>
          <Route exact path={ROUTES.HOME} component={Home} />
          <Route path={ROUTES.GENERATE} component={Generate} exact />
          <Route path={ROUTES.COMPARE} component={Compare} exact />
          <Route path={ROUTES.ACCOUNT} component={Account} exact />
          <Route path={ROUTES.REGISTER} component={Register} exact />
          <Route path={ROUTES.LOGIN} component={Login} exact />
          <Route path={ROUTES.SELECTMODULES} component={SelectModules} exact />
        </Switch>
      </div>
    );
  }
}

export default withAuthentication(App);
