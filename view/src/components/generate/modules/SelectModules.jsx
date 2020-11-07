import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import { LinearProgress } from "@material-ui/core"
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { withFirebase } from "../../firebase";
import ModuleDisplay from "./ModuleDisplay";
import SearchBar from './SearchBar'
import SelectedModules from './SelectedModules'
import ErrorMsg from '../ErrorMsg'


import "./SelectModule.scss"

const sample = [{ moduleCode: "cs-04343", title: "erewrewrew" }, { moduleCode: "cs-04343", title: "erewrewrew" }, { moduleCode: "cs-2323323", title: "4343434" }, { moduleCode: "cs-3434343", title: "erewrewrew" }, { moduleCode: "cs-344", title: "erewrewrew" }]

class SelectModules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            isLoaded: false,
            modules: [],
            selected: this.props.mods,
            display: sample,
            sem: this.props.sem,
        };

        this.filterDisplay = this.filterDisplay.bind(this);
        this.selectMod = this.selectMod.bind(this);
        this.delMod = this.delMod.bind(this);
        this.submitModules = this.submitModules.bind(this);
        this.clear = this.clear.bind(this);
    }

    /*
    componentDidMount() {
        this.props.firebase.fetchModules()
            .then((modules) => {
                this.setState({
                    isLoaded: true,
                    modules: modules,
                    display: modules,
                });
            }).catch(
                (err) => { console.log(err); }
            );

    }
    */

    render() {
        return (
            <div>
                {
                    this.state.isLoaded ?
                        <Grid
                            container
                            direction="row"
                            justify="space-around"
                            alignItems="flex-start"
                        >
                            <Box width="50%">
                                <SearchBar onChange={this.filterDisplay} />
                                <ModuleDisplay className="module-display" modules={this.state.display} selectMod={this.selectMod} />
                            </Box>
                            <Box width="40%" >
                                <Grid
                                    container
                                    direction="column"
                                    justify="flex-start"
                                    alignItems="center"
                                >
                                    <h4> Selected Modules </h4>
                                    <SelectedModules mods={this.state.selected} delMod={this.delMod} />
                                    {
                                        this.state.error !== "" ?
                                            <Box m={1}>
                                                <ErrorMsg msg={this.state.error} />
                                            </Box>
                                            :
                                            <div></div>
                                    }
                                    <Box m={1}>
                                        <Button style={{ margin: "5px" }} variant="outlined" color="secondary" onClick={this.clear}>
                                            Clear
                                        </Button>
                                        <Button style={{ margin: "5px" }} variant="outlined" color="primary" onClick={this.submitModules}>
                                            Next
                                        </Button>
                                    </Box>
                                </Grid>
                            </Box>
                        </Grid>
                        :
                        <LinearProgress />
                }
            </div>
        )
    }

    submitModules() {
        if (this.state.selected.length === 0) {
            this.setState({ error: "Please select at least 1 module" })
            return;
        }
        var selected = [...this.state.selected];
        let toSubmit = [];
        for (var x of selected) {
            toSubmit.push(x.moduleCode);
        }
        this.props.firebase.setModules(toSubmit);
        this.props.nextStep();
    }

    async filterDisplay(filter) {
        const allModules = this.state.modules;
        if (filter !== '') {
            const r = await asyncFilter(allModules, module => new RegExp(filter, 'i').test((module.moduleCode + " " + module.title)));
            this.setState({ display: r });
        } else {
            this.setState({ display: allModules })
        }

    }

    selectMod(m) {
        var mods = [...this.state.selected];
        if (!mods.some(p => p.moduleCode === m.moduleCode)) {
            mods = [...this.state.selected, m];
            this.setState({ selected: mods, error: "" })
            this.props.setMods(mods);
        } else {
            this.setState({ error: "Module was already selected." });
        }
    }

    delMod(ind) {
        let mods = [...this.state.selected];
        mods = [...mods.slice(0, ind),
        ...mods.slice(ind + 1)]
        this.setState({ selected: mods });
        this.props.setMods(mods);
    }

    clear() {
        this.setState({ selected: [], error: "" })
        this.props.setMods([]);
    }
}

const asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_v, index) => results[index]);
}

export default withFirebase(SelectModules);
