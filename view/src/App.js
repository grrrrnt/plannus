import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import NavBar from "./components/Navbar";
import Home from "./components/Home";
import Generate from "./components/Generate";
import Compare from "./components/Compare";
import Account from "./components/Account";
// import './App.css';

// const { width, height } = Dimensions.get('window');
const useStyles = makeStyles({
  app: {
    background: '#000000',
    width: '100%',
    height: 'auto',
    'text-align': 'center',
  }
});

function App() {
  const styles = useStyles();

  return (
    <div className={styles.app}>
      <NavBar></NavBar>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/generate" component={Generate} />
        <Route path="/compare" component={Compare} />
        <Route path="/account" component={Account} />
      </Switch>
    </div>
  );
}

export default App;
