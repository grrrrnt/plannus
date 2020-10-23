import React from 'react';
import { withFirebase } from '../firebase';

const AuthUserContext = React.createContext(null);

const withAuthenticationProvider = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                authUser: null,
            };
        }

        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    authUser
                        ? this.setState({ authUser })
                        : this.setState({ authUser: null });
                },
            );
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    }

    return withFirebase(WithAuthentication);
};

const withAuthenticationConsumer = Component => props => (
    <AuthUserContext.Consumer>
        {authUser =>
            <Component {...props} authUser={authUser} />
        }
    </AuthUserContext.Consumer>
);
 
export default AuthUserContext;
export { withAuthenticationProvider, withAuthenticationConsumer };