//const { admin, db } = require('../util/admin');
//const config = require('../util/config');
//
//const firebase = require('firebase');
//
//firebase.initializeApp(config);
//
//const { validateLoginData, validateSignUpData } = require('../util/validators');
//
//// Login
//exports.loginUser = (request, response) => {
//    const user = {
//        email: request.body.email,
//        password: request.body.password
//    }
//
//    const { valid, errors } = validateLoginData(user);
//	if (!valid) return response.status(400).json(errors);
//
//    firebase
//        .auth()
//        .signInWithEmailAndPassword(user.email, user.password)
//        .then((data) => {
//            return data.user.getIdToken();
//        })
//        .then((token) => {
//            return response.json({ token });
//        })
//        .catch((error) => {
//            console.error(error);
//            return response.status(403).json({ general: 'wrong credentials, please try again'});
//        })
//};