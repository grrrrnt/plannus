import React, { Component } from "react";
import  { FirebaseContext } from '../firebase';

class Home extends Component {
    render() {

        return (
            <FirebaseContext.Consumer>
                {firebase => {
                    if (firebase) {
                    return (
                        <div><h1>I've access to Firebase and render something.</h1></div>
                    )
                    } else {
                        return (
                            <div>Error</div>
                        )
                    }
                }}
            </FirebaseContext.Consumer>
        )
    }
}

export default Home;