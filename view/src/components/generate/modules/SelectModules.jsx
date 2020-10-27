import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import { withFirebase } from "../../firebase";
import ModuleDisplay from "./ModuleDisplay";
import SearchBar from './SearchBar'


const asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));
  
    return arr.filter((_v, index) => results[index]);
}

class SelectModules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            modules: [],
            selected:[],
            display: [],
        };

        this.filterDisplay = this.filterDisplay.bind(this);
    }


    
    async filterDisplay(filter) {
        //console.log(filter);
        
        const allModules = this.state.modules;
        //this.setState({isLoaded: false,});

        if (filter !== '') {
            const r = await asyncFilter(allModules, module => module.moduleCode.includes(filter.toUpperCase()));
            this.setState({
                display: r,
            });
            console.log(r);
            /*
            let filteredDisplay = [];
            filteredDisplay = allModules.filter(module => module.moduleCode.includes(filter.toUpperCase()));
            this.setState({
                display: filteredDisplay
            });
            */
        } else {
            this.setState({
                display: allModules,
            })
        }

        //this.setState({isLoaded: true,})
        
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
        */
        
        fetch("https://api.nusmods.com/v2/2020-2021/moduleList.json")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        modules: result,
                        display : result,
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error,
                    });
                }
            )
            
    }

    render() {
        return(
            <div>
                <SearchBar onChange = {this.filterDisplay} />
                {
                    this.state.isLoaded ?
                        <div>
                        <ModuleDisplay modules = {this.state.display} />
                        </div>
                    : <div> loading </div>
                }
            </div>


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
