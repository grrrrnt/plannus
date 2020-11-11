import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import NavBar from "../navigation";
import Home from "../home/Home";
import Generate from "../generate";
import Account from "../account/Account";
import SharedTimetable from '../shared-timetable/SharedTimetable';
import Saved from '../saved-timetables';

import { withFirebase } from "../../context"
import * as ROUTES from '../../util/Routes';

class Main extends Component {

    render() {
        return (
            <div className="main-container" >
                <NavBar></NavBar>
                <div className="main-content-container">
                    <Route exact path={ROUTES.HOME} component={Home} />
                    <Route path={ROUTES.GENERATE} component={Generate} exact />
                    <Route path={ROUTES.ACCOUNT} component={Account} exact />
                    <Route path={ROUTES.SAVED} component={Saved} exact />
                    <Route path={ROUTES.TIMETABLE} component={SharedTimetable} exact />
                </div>
            </div >
        );
    }
}

export default withFirebase(Main);
