import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import NavBar from "../navigation";
import Home from "../home/Home";
import Generate from "../generate";
import Compare from "../compare/Compare";
import Account from "../account/Account";
import SharedTimetable from '../shared-timetable/SharedTimetable';
import SavedTimetables from '../saved-timetables';

import { withFirebase } from "../firebase"

import * as ROUTES from '../../util/Routes';

class Main extends Component {

    render() {
        return (
            <div className="main-container" >
                <NavBar></NavBar>
                <div className="main-content-container">
                    <Route exact path={ROUTES.HOME} component={Home} />
                    <Route path={ROUTES.GENERATE} component={Generate} exact />
                    <Route path={ROUTES.COMPARE} component={Compare} exact />
                    <Route path={ROUTES.ACCOUNT} component={Account} exact />
                    <Route path={ROUTES.SAVEDTIMETABLES} component={SavedTimetables} exact />
                    <Route path={ROUTES.TIMETABLE} component={SharedTimetable} exact />
                </div>
            </div >
        );
    }
}

export default withFirebase(Main);
