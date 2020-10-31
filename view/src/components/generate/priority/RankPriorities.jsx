import React, { Component } from "react";
import { withFirebase } from '../../firebase';
import { DragDropContext } from "react-beautiful-dnd";
import './priorities.css';
import { v4 } from 'uuid';
import _ from "lodash";
import PriorityList from './PriorityList';
import PriorityAdder from './PriorityAdder';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { initialise, reformatForSub } from './priorityfunc';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';



/*
format of items
id: v4(),
    type: "LunchBreakPriority",
    name: "",
    fields: {hours: 2},
    rank: 7,
    mustHave: true,
}
*/

class RankPriorities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Priorities",
            items: [],
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
        var priorities = this.props.priorities;
        const init = initialise(priorities);
        this.setState({
            items: init,
            loaded: true,
        });
    }
    /* format of priority
    {
        name: 'Select a Priority',
        type: "",
        fields: {
            time: defaultDate,
            fromTime: defaultDate,
            toTime: defaultDate,
            hours: 0,
    },  
     */
    addPriority(priority) {
        const priorities = this.state.items;
        const duplicate = priorities.some(p => p.name === priority.name);
        if (duplicate) {
            return "Priority was already selected.";
        }
        this.setState({
            items: [{
                id: v4(),
                type: priority.type,
                fields: priority.fields,
                name: priority.name,
                rank: 0,
                mustHave: false
            },
            ...this.state.items
            ],
            error: "",
        });
        return "success";
    }

    delPriority(index) {
        var items = [...this.state.items];
        this.setState({
            items: [
                ...items.slice(0, index),
                ...items.slice(index + 1)
            ]
        })
    }

    toggleMH(index) {
        const items = [...this.state.items];
        this.setState({
            items: [
                ...items.slice(0, index),
                {
                    ...items[index],
                    mustHave: !items[index].mustHave,
                },
                ...items.slice(index + 1)
            ]
        })
    }

    handleDragEnd(data) {
        const { source, destination } = data;
        if (!destination) {
            console.log("not dropped in droppable");
            return;
        }

        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            console.log("dropped in same place")
            return;
        }

        if (destination.index !== source.index && destination.droppableId === source.droppableId) {
            console.log("dropped in same place but different index")
        }

        //changing index of items if dropped into different index
        const pCopy = { ...this.state.items[source.index] };
        var updatedState = this.state;
        updatedState.items.splice(source.index, 1);
        updatedState.items.splice(destination.index, 0, pCopy);
        this.setState(updatedState);
    }

    handleSubmit() {
        if (this.state.items.length === 0) {
            this.setState({ error: "Please select at least 1 priority" })
            return;
        }
        var items = _.cloneDeep(this.state.items);
        const toSubmit = reformatForSub(items);

        var setUserPriorities = this.props.firebase.functions.httpsCallable('setUserPriorities');
        setUserPriorities({ priorities: toSubmit })
            .then(
                (result) => {
                    console.log(result);
                }
            ).catch(
                (err) => {
                    console.log(err);
                }
            );

        //this.props.setPriorities(toSubmit);
        this.props.nextStep();
    }

    clear() {
        this.setState({
            items: [],
            error: "",
        })
    }


    render() {
        const { loaded, items, title, error } = this.state;
        return (
            <div>
                <Grid container justify="center">
                    <h2 className={"title"}> What priorities are important to you?</h2>
                </Grid>
                <PriorityAdder addPriority={this.addPriority} />


                <Grid container justify="center">
                    <h3 className={"title"} style={{ whiteSpace: "pre-wrap" }} >
                        Drag to rank your priorities {"\n"}
                    </h3>
                </Grid>

                {
                    loaded ?
                        <div>
                            <DragDropContext onDragEnd={this.handleDragEnd}>
                                <Grid container justify="center">
                                    <PriorityList priorities={items} title={title} delPriority={this.delPriority} toggleMH={this.toggleMH} />
                                </Grid>
                            </DragDropContext>
                        </div>
                        :
                        <Box m={2} pt={3}>
                            <Grid container justify="center">
                                <CircularProgress />
                            </Grid>
                        </Box>
                }

                {
                    error !== "" ?
                        <Grid container justify="center">
                            <Box m={1}>
                                <Alert severity="error">
                                    {error}
                                </Alert>
                            </Box>
                        </Grid>
                        : <div></div>
                }

                <Grid container justify="center">
                    <Box m={1}>
                        <Button variant="outlined" color="secondary" onClick={this.clear}>
                            Clear
                        </Button>
                    </Box>
                    <Box m={1}>
                        <Button variant="outlined" color="primary" onClick={this.handleSubmit}>
                            Next
                        </Button>
                    </Box>
                </Grid>

            </div>

        )
    }
}

export default withFirebase(RankPriorities);




