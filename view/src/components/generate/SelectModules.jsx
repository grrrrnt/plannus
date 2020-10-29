import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../firebase';


class SelectModules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        const retrieveModules = this.props.firebase.func.httpsCallable("retrieveModules");
        retrieveModules()
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        ...result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    render() {
        const { error, isLoaded, success, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!success) {
            return <div>Error, try selecting the semester</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <ul>
                    {items.map(item => (
                        <li key={item.moduleCode}>
                            {item.moduleCode} {item.title}
                        </li>
                    ))}
                </ul>
            );
        }
    }
}

export default withRouter(withFirebase(SelectModules));
