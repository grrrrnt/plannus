import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
 
import { withFirebase } from '../firebase';
import * as ROUTES from '../../util/Routes';
 
const Register = () => (
  <div>
    <h1>Register</h1>
    <RegisterForm />
  </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    confirmPassword: '',
    error: null,
  };  
 
class RegisterFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const {email, password } = this.state;
 
    this.props.firebase
      .doRegisterUserWithEmailAndPassword(email, password)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
 
    event.preventDefault();
  }
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  render() {
    const {
        email,
        password,
        confirmPassword,
        error,
      } = this.state;

      const isInvalid =
      password !== confirmPassword ||
      password === '' ||
      email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <input
          name="confirmPassword"
          value={confirmPassword}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>
 
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
 
const RegisterLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.REGISTER}>Sign Up</Link>
  </p>
);

const RegisterForm = withRouter(withFirebase(RegisterFormBase))
 
export default Register;
 
export { RegisterForm, RegisterLink };