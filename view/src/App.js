import React from 'react';
import { Switch, Route } from 'react-router-dom';

import NavBar from "./components/Navbar";
import Home from "./components/Home";
import Generate from "./components/Generate";
import Compare from "./components/Compare";
import Account from "./components/Account";

function App() {

  return (
    <div className="App">
      <NavBar></NavBar>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/generate" component={Generate} exact />
        <Route path="/compare" component={Compare} exact />
        <Route path="/account" component={Account} exact />
      </Switch>
    </div>
  );
}

export default App;
