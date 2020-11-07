import React, { Component } from "react";
import { withFirebase } from '../../firebase';
import './priorities.css';
import { v4 } from 'uuid';
import _ from "lodash";
import PriorityList from './PriorityList';
import PriorityAdder from './PriorityAdder';
import ErrorMsg from "../ErrorMsg"
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { initialise, reformatForSub } from './priorityfunc';
import Box from '@material-ui/core/Box';
import { LinearProgress } from "@material-ui/core"

class RankPriorities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Priorities",
            items: this.props.init,
            loaded: false,
            error: "",
        };

        this.addPriority = this.addPriority.bind(this);
        this.delPriority = this.delPriority.bind(this);
        this.toggleMH = this.toggleMH.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clear = this.clear.bind(this);
    }

    componentDidMount() {
        if (!this.props.priorityFetched) { //only fetch if component has not fetched from db previously
            this.props.firebase.getPriorities().then((res) => {
                if (res.priorities !== null) {
                    const init = initialise(res.priorities);
                    this.props.setPriorities(init)
                    this.setState({ items: init, loaded: true });
                } else {
                    this.setState({ loaded: true });
                }
                this.props.setFetchedDb("priority");   
            })
        } else {
            this.setState({ loaded: true });
        }
    }

    addPriority(priority) {
        let priorities = [...this.state.items];
        const duplicate = priorities.some(p => p.name === priority.name);
        if (duplicate) {
            return "Priority was already selected.";
        }
        priorities = [{
            id: v4(),
            type: priority.type,
            fields: priority.fields,
            name: priority.name,
            rank: 0,
            mustHave: false
        },
        ...this.state.items
        ];

        this.setState({
            items: priorities,
            error: "",
        });
        this.props.setPriorities(priorities);
        return "success";
    }

    delPriority(index) {
        let priorities = [
            ...this.state.items.slice(0, index),
            ...this.state.items.slice(index + 1)
        ];
        this.setState({
            items: priorities
        })

        this.props.setPriorities(priorities)
    }

    toggleMH(index) {
        const items = [...this.state.items];
        let priorities = [
            ...items.slice(0, index),
            {
                ...items[index],
                mustHave: !items[index].mustHave,
            },
            ...items.slice(index + 1)
        ];

        this.setState({
            items: priorities,
        })
        this.props.setPriorities(priorities)
    }

    handleDragEnd(data) {
        const { source, destination } = data;
        if (!destination) {
            return;
        }
        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            return;
        }
        const pCopy = { ...this.state.items[source.index] }; //changing index of items if dropped into different index
        var updatedState = this.state;
        updatedState.items.splice(source.index, 1);
        updatedState.items.splice(destination.index, 0, pCopy);
        this.setState(updatedState);
        this.props.setPriorities(updatedState.items);
    }

    handleSubmit() {
        if (this.state.items.length === 0) {
            this.setState({ error: "Please select at least 1 priority" })
            return;
        }
        var items = _.cloneDeep(this.state.items);
        const priorities = reformatForSub(items);
        this.props.firebase.setPriorities(priorities);
        this.props.nextStep();
    }

    clear() {
        this.setState({
            items: [],
            error: "",
        })
        this.props.setPriorities([]);
    }


    render() {
        const { loaded, items, title, error } = this.state;
        return (
            <div>
                {
                    loaded ?
                        <Grid>
                            <PriorityAdder addPriority={this.addPriority} />
                            <PriorityList priorities={items} title={title} delPriority={this.delPriority} toggleMH={this.toggleMH} handleDragEnd={this.handleDragEnd} />
                            <Grid
                                container
                                direction="column"
                                justify="center"
                                alignItems="center"
                            >
                                {
                                    error !== "" ?
                                        <Box m={1}>
                                            <ErrorMsg msg={error} />
                                        </Box>
                                        : <div></div>
                                }
                                <Box m={1}>
                                    <Button style={{margin: "5px"}} variant="outlined" color="secondary" onClick={this.clear}>
                                        Clear
                                    </Button>
                                    <Button style={{margin: "5px"}} variant="outlined" color="primary" onClick={this.handleSubmit}>
                                        Next
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                        :
                        <LinearProgress />
                }
            </div>

        )
    }
}

export default withFirebase(RankPriorities);




