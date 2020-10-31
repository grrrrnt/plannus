import React from 'react'
import firebase from 'firebase'
import { StyledFirebaseAuth } from 'react-firebaseui';

import { withFirebase } from './context';

class FirebaseAuth extends React.Component {
    constructor(props) {
        super(props)

        const auth = props.firebase.auth
        // Configure FirebaseUI.
        this.uiConfig = {
            autoUpgradeAnonymousUsers: true,
            signInFlow: 'popup',
            signInOptions: [
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    customParameters: {
                        // Forces account selection even when one account
                        // is available.
                        prompt: 'select_account'
                    }
                },
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
            signInSuccessUrl: "/",
            callbacks: {
                // signInFailure callback must be provided to handle merge conflicts which
                // occur when an existing credential is linked to an anonymous user.
                signInFailure: function (error) {
                    // For merge conflicts, the error.code will be
                    // 'firebaseui/anonymous-upgrade-merge-conflict'.
                    if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
                        return Promise.resolve();
                    }
                    const cred = error.credential; // credential the user tried to sign in with
                    const anonUser = auth.currentUser;
                    // TODO: Copy data from anon user to acct user

                    return auth.signInWithCredential(cred)
                        .then((function () {
                            anonUser.delete()
                        }));
                }
            }
        }

    };

    render() {
        return (
            <React.Fragment>
                <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={this.props.firebase.auth} />
            </React.Fragment>
        )
    }
}

export default withFirebase(FirebaseAuth)