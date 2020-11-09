import React from 'react';
import { withFirebase } from '../firebase';

const AuthUserContext = React.createContext(null);

const withAuthUserProvider = Component => {
    class WithAuthUser extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                loggedIn: props.firebase.isLoggedIn,
                isUserAnonymous: localStorage.getItem("plannus-anonUser")
            };
        }

        componentDidMount() {
            this.listener = this.props.firebase.observeCurrentUser(this.onAuthStateChanged)
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }

        onAuthStateChanged = (authUser) => {
            if (authUser) {
                this.setState({
                    loggedIn: true,
                    isUserAnonymous: authUser.isAnonymous
                });
                localStorage.setItem("plannus-anonUser", authUser.isAnonymous)
            } else {
                this.setState({
                    loggedIn: false,
                    isUserAnonymous: null
                });
                localStorage.removeItem("plannus-anonUser")
            }
        }
    }

    return withFirebase(WithAuthUser);
};

const withAuthUserConsumer = Component => props => (
    <AuthUserContext.Consumer>
        {authUser => 
            <Component {...props} authUser={authUser} />
        }
    </AuthUserContext.Consumer>
);

export { withAuthUserProvider, withAuthUserConsumer };