import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import { withFirebase } from "../../firebase";
import SearchBar from './SearchBar'

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
        
    
        /*
        var retrieveModules = this.props.firebase.functions.httpsCallable('retrieveModules');
        retrieveModules({year: 2020, semester: 1}).then(function(result) {
            var res = result.data.modules;
            this.setState({
                items:res,
            })
        }).catch(function(err) {
            console.log(err.message);
        });
        //const moduleList = this.fetchModuleList();
        
        
        fetch("https://api.nusmods.com/v2/2020-2021/moduleList.json")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
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
            )
            */
    }

    render() {
        return(
            <div>hello</div>
        )
    }


    /*
    render() {
        const { error, isLoaded, items } = this.state;
        console.log(items[0]);
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                <SearchBar />
                <ul>
                    {items.map(item => (
                        <li key={item.moduleCode}>
                            {item.moduleCode} {item.title}
                        </li>
                    ))}
                </ul>
                </div>
            );
        }
    }
    */
}

export default withFirebase(SelectModules);
