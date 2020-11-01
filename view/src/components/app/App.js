import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Main from "./Main"
import { Login, withAuthenticationProvider } from "../authentication";

import * as ROUTES from '../../util/Routes';
import "./App.scss"

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
