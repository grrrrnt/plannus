import React, { Component } from "react";
import { withFirebase } from "../../firebase";
import ModuleDisplay from "./ModuleDisplay";
import SearchBar from './SearchBar'
import SelectedModules from './SelectedModules'
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import _ from "lodash";

const asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));
  
    return arr.filter((_v, index) => results[index]);
}

class SelectModules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            isLoaded: false,
            modules: [],
            selected:this.props.mods,
            display: [],
            sem: this.props.sem,
        };

        this.filterDisplay = this.filterDisplay.bind(this);
        this.selectMod = this.selectMod.bind(this);
        this.delMod = this.delMod.bind(this);
        this.submitModules = this.submitModules.bind(this);
    }

    submitModules() {
        if (this.state.selected.length === 0) {
            this.setState({
                error: "Please select at least 1 module"
            })
            return;
        }

        var toSubmit = [];
        const selected = _.cloneDeep(this.state.selected);
        for (var x of selected) {
            toSubmit.push(x.moduleCode);
        }
        console.log(toSubmit);

        var setUserModules = this.props.firebase.functions.httpsCallable('setUserModules');
        setUserModules({modules: toSubmit})
            .then(
                (result) => {
                    console.log(result);
                }
            ).catch(
                (err) => {
                    console.log(err);
                }
            );

        this.props.setMods(selected);
        this.props.nextStep();
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
        const year = parseInt(this.state.sem.split(" ")[0]);
        const sem = parseInt(this.state.sem.split(" ")[1]);
        console.log(year);
        console.log(sem);
        var retrieveModules = this.props.firebase.functions.httpsCallable('retrieveModules');
        retrieveModules({year: year, semester: sem})      // To change depending on selected option
        .then(
            (result) => {
            var res = result.data.modules;
            this.setState({
                isLoaded: true,
                modules: res,
                display : res,
            });
        }).catch(
            (err) => {console.log(err);}
        );
            
    }

    selectMod(m) {
        var mods = [...this.state.selected];
        if (!mods.some(p => p.moduleCode === m.moduleCode)) {
            this.setState({
                selected: [...this.state.selected, m],
                error: "",
            })
        } else {
            alert("Module was already selected.");
        }    
    }

    delMod(ind) {
        var mods = [...this.state.selected];
        this.setState( {
            selected: [...mods.slice(0, ind), 
                        ...mods.slice(ind + 1)],
        });
    }

    render() {
        console.log(this.state.selected);
        return(
            
            <div>
                <Grid container >
                <Box m = {2} width = "50%">
                    <SearchBar onChange = {this.filterDisplay} />
                    {
                    this.state.isLoaded ?
                        <ModuleDisplay modules = {this.state.display} selectMod = {this.selectMod} />
                    : 
                        <Box m={2} pt={3}>
                            <CircularProgress />
                        </Box>
                    }
                </Box>
                <Box m = {2} width = "40%" >
                    <SelectedModules mods={this.state.selected} delMod = {this.delMod} />
                    <Grid container justify = "center">
                        {
                            this.state.error !== "" ? 
                                <Box m={1}>
                                    <Alert severity="error">
                                        {this.state.error}
                                    </Alert>
                                </Box>
                            :
                                <div></div>
                        }
                        <Button variant="outlined" color="primary" onClick = {this.submitModules}>
                                    Next
                        </Button>
                    </Grid>
                </Box>
                </Grid>
                
            </div>


        )
    }

}

export default withFirebase(SelectModules);
