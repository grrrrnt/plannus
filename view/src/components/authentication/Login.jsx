import React from 'react';
import { FirebaseAuth, withFirebase } from '../firebase';

const Login = () => (
  <div>
    <h1>Login</h1>
    <FirebaseAuth />
  </div>
);

export default Login;