import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Main from "./Main"
import NavBar from "../navigation";
import Home from "../home/Home";
import Generate from "../generate";
import Compare from "../compare/Compare";
import Account from "../account/Account";
import { Login, withAuthenticationProvider } from "../authentication";

import SelectModules from '../generate/SelectModules';

import * as ROUTES from '../../util/Routes';

class App extends Component {
  render() {
    return (
      <div className="App" >
        <Switch>
          <Route path={ROUTES.LOGIN} component={Login} exact />
          <Route path={ROUTES.HOME} component={Main} />
        </Switch>
      </div>
    );
  }
}

export default withAuthenticationProvider(App);