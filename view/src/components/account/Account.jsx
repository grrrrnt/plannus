import React, { Component } from "react";
import { Redirect } from "react-router-dom"
import { Button, TextField, IconButton, Snackbar, Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import { withFirebase } from "../firebase";
import { withAuthUserConsumer } from "../authentication"
import { LogoutButton } from "../authentication";

import { LOGIN } from "../../util/Routes"

class Account extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: props.firebase.currentUser,
            email: props.firebase.currentUser ? props.firebase.currentUser.email : "",
            displayName: props.firebase.currentUser ? props.firebase.currentUser.displayName : "",
            emailProvider: props.firebase.currentUser ? props.firebase.currentUser.providerData[0].providerId === "password" : false,
            showUpdatePassword: false,
            showConfirmPassword: false,
            showPassword: false,
            passwordMismatchText: "",
            requirePasswordText: "",
            errorMsg: "",
            successMsg: ""
        }
        // for cancelling of async taks when unmounted
        this.abortController = new AbortController()
        this.signal = this.abortController.signal
    }

    componentDidMount() {
        this.observer = this.props.firebase.observeCurrentUser((user) => {
            if (this.signal?.aborted) return
            this.updateState(user)
        })
    }

    updateState = (user) => {
        if (user) {
            this.setState({
                currentUser: user,
                email: user.email,
                displayName: user.displayName,
                emailProvider: user.providerData[0].providerId === "password"
            })
        }
    }

    componentWillUnmount() {
        this.observer()
        this.abortController.abort()
    }

    render() {
        return (this.props.authUser.loggedIn)
            ? (this.state.currentUser
                ? (
                    <div>
                        <h1>Account</h1>
                        <form onSubmit={this.onSaveChanges} id="account-form">
                            <TextField
                                disabled={!this.state.emailProvider}
                                name="email"
                                id="email"
                                label="Email"
                                type="email"
                                placeholder={this.state.email ? this.state.email : "Enter your email"}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                onChange={this.onChange}
                            />
                            <TextField
                                name="displayName"
                                id="displayName"
                                label="Display Name"
                                placeholder={this.state.displayName ? this.state.displayName : "Enter your display name"}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                onChange={this.onChange}
                            />
                            {this.state.emailProvider
                                ? (<React.Fragment>
                                    <TextField
                                        error={this.state.passwordMismatchText !== ""}
                                        autoComplete="off"
                                        name="updatePassword"
                                        type={this.state.showUpdatePassword ? "text" : "password"}
                                        id="update-password"
                                        label="Update password"
                                        placeholder="Enter a password to update"
                                        helperText={this.state.passwordMismatchText}
                                        fullWidth
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    edge="end"
                                                    onMouseDown={() => this.setState({ showUpdatePassword: true })}
                                                    onMouseUp={() => this.setState({ showUpdatePassword: false })}
                                                >
                                                    {this.state.showUpdatePassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            )
                                        }}
                                        variant="outlined"
                                        onChange={this.onNewPasswordChange}
                                    />
                                    <TextField
                                        error={this.state.passwordMismatchText !== ""}
                                        autoComplete="off"
                                        name="confirmPassword"
                                        type={this.state.showConfirmPassword ? "text" : "password"}
                                        id="confirm-password"
                                        label="Confirm password"
                                        placeholder="Confirm the password to update"
                                        helperText={this.state.passwordMismatchText}
                                        fullWidth
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    edge="end"
                                                    onMouseDown={() => this.setState({ showConfirmPassword: true })}
                                                    onMouseUp={() => this.setState({ showConfirmPassword: false })}
                                                >
                                                    {this.state.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            )
                                        }}
                                        variant="outlined"
                                        onChange={this.onNewPasswordChange}
                                    />
                                    <TextField
                                        error={this.state.requirePasswordText !== ""}
                                        name="password"
                                        type={this.state.showPassword ? "text" : "password"}
                                        id="password"
                                        label="Password"
                                        placeholder="Enter the current password for verification"
                                        helperText={this.state.requirePasswordText}
                                        fullWidth
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    edge="end"
                                                    onMouseDown={() => this.setState({ showPassword: true })}
                                                    onMouseUp={() => this.setState({ showPassword: false })}
                                                >
                                                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            )
                                        }}
                                        variant="outlined"
                                        onChange={this.onChange}
                                    />
                                </React.Fragment>)
                                : ''
                            }
                            <Box style={{ marginTop: "1em" }}>
                                <Button type="submit" variant="outlined">Save Changes</Button>
                                <LogoutButton style={{ marginLeft: "1em" }} />
                            </Box>
                        </form>
                        <Snackbar
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            open={this.state.errorMsg !== "" || this.state.successMsg !== ""}
                            autoHideDuration={2000}
                            onClose={this.handleSnackbarClose}
                        >
                            <Alert onClose={this.handleSnackbarClose} severity={this.state.errorMsg ? "error" : "success"}>
                                {this.state.errorMsg ? this.state.errorMsg : this.state.successMsg}
                            </Alert>
                        </Snackbar>
                    </div>
                )
                : ''
            )
            : (
                <Redirect to={LOGIN} />
            )
    }

    onSaveChanges = (event) => {
        event.preventDefault()
        if (this.state.emailProvider && event.target.updatePassword.value !== event.target.confirmPassword.value) {
            this.setState({ errorMsg: "Please ensure the new password matches" })
            return
        }

        if (this.state.emailProvider && event.target.password.value === "") {
            this.setState({
                errorMsg: "Please enter your current password for verification",
            })
            return
        }

        const details = {
            email: this.state.emailProvider ? event.target.email.value : "",
            displayName: event.target.displayName.value,
            newPassword: this.state.emailProvider ? event.target.updatePassword.value : "",
        }

        const reauth = this.state.emailProvider
            ? this.props.firebase.reauthenticateWithPassword(event.target.password.value)
            : this.props.firebase.reauthenticateWithPopup()
        reauth
            .then(() => {
                this.props.firebase.updateAccount(details)
                    .then((res) => {
                        if (res.success) {
                            this.updateState(this.props.firebase.currentUser)
                            document.getElementById("account-form").reset()
                            this.setState({ successMsg: "Account successfully updated!" })
                        } else {
                            this.setState({ errorMsg: res.message })
                        }
                    })
            }).catch((err) => {
                this.setState({ errorMsg: "Could not verify user." })
            })
    }

    onNewPasswordChange = () => {
        if (document.getElementById("update-password").value !== document.getElementById("confirm-password").value) {
            this.setState({ passwordMismatchText: "Please ensure your password matches" })
        } else {
            this.setState({ passwordMismatchText: "" })
        }
        this.onChange()
    }

    onChange = () => {
        if (!this.state.emailProvider) return
        if (document.getElementById("password").value === "") {
            this.setState({ requirePasswordText: "Password is required for verification" })
        } else {
            this.setState({ requirePasswordText: "" })
        }
    }

    handleSnackbarClose = () => this.setState({ errorMsg: "", successMsg: "" })
}

export default withAuthUserConsumer(withFirebase(Account));