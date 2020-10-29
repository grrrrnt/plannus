import firebase from 'firebase';
import app from 'firebase/app';
import 'firebase/firestore'


const config = {
    apiKey: "AIzaSyDnBTK2BzKIBSpoG83mlbKicu4puvrFpnc",
    authDomain: "plannus-cfd18.firebaseapp.com",
    databaseURL: "https://plannus-cfd18.firebaseio.com",
    projectId: "plannus-cfd18",
    storageBucket: "plannus-cfd18.appspot.com",
    messagingSenderId: "4682891865",
    appId: "1:4682891865:web:d5dfd11ca8e684d1336748",
    measurementId: "G-QX1D2DW4FX"
};

class Firebase {
    constructor() {
        firebase.initializeApp(config);

        this.auth = app.auth();
        this.db = app.firestore();
        this.func = app.functions();
    }

    loginAnonymously = () =>
        this.auth.signInAnonymously()

    doRegisterUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doLoginWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doLogout = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);
}

export default Firebase;