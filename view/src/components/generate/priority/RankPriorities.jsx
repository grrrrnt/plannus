import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../../firebase';
import {DragDropContext} from "react-beautiful-dnd";
import './priorities.css';
import {v4} from 'uuid';
import PriorityList from './PriorityList'
import AddPriority from './AddPriority'
import Grid from '@material-ui/core/Grid';



const item = {
    id: v4(),
    name: "more free days",
    mustHave: "1",
    rank: 0
}

const item2 = {
    id: v4(),
    name: "free after 2pm",
    mustHave: "1",
    rank: 0
}

const item3 = {
    id: v4(),
    name: "free after 3pm",
    mustHave: "0",
    rank: 0
}


const item4 = {
    id: v4(),
    name: "free after 5pm",
    mustHave: "0",
    rank: 0
}


class RankPriorities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Priorities",
            items: [item, item2, item3, item4],
        };

        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deletePriority = this.deletePriority.bind(this);
        this.addPriority = this.addPriority.bind(this);
        this.toggleStarPriority = this.toggleStarPriority.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        const itemCopy = {...this.state.items[source.index]};
        var updateState = this.state;
        updateState.items.splice(source.index, 1);
        updateState.items.splice(destination.index, 0, itemCopy);
        this.setState(updateState);
        console.log(this.state);
    }

    addPriority(name) {
        this.setState({
            items: [{
                id: v4(),
                name: name,
                mustHave: "0",
                rank: 0
                },
            ...this.state.items
            ],
        });
    }

    handleChange(e) {
        this.setState({
            input: e.target.value,
        })
    }

    deletePriority(ind) {
        var updatedItems = this.state.items;
        updatedItems.splice(ind, 1);
        this.setState({
            items: updatedItems,
        });
    }

    toggleStarPriority(ind) {
        var updatedItems = this.state.items;
        const isMustHave = updatedItems[ind].mustHave;
        if (isMustHave === "0") {
            updatedItems[ind].mustHave = "1";
        } else {
            updatedItems[ind].mustHave = "0";
        }
        this.setState({
            items: updatedItems,
        })
    }

    handleSubmit() {
        const updatedRank = this.state.items;
        for (var i = 0; i < updatedRank.length; i ++) {
            updatedRank[i].rank = i + 1;
        }
        this.setState({
            items: updatedRank
        })

        console.log(updatedRank);
    }

    render() {
        return (
            <div>
                <Grid container justify = "center">
                    <h1 className = {"title"}> Generate Timetables</h1>
                </Grid>
                <Grid container justify = "center">
                    <h2 className = {"title"}> What priorities are important to you?</h2>
                </Grid>
            <div className = {"rank-priorities"}>
                <Grid container justify = "center">
                    <AddPriority addPriority = {this.addPriority} />
                </Grid>
                <DragDropContext onDragEnd = {this.handleDragEnd}>
                    <div className = {"column"}>
                        <h3>Drag to rank your priorities</h3>
                        <PriorityList priorities = {this.state.items} title = {this.state.title} deletePriority = {this.deletePriority} toggleStarPriority = {this.toggleStarPriority} />
                    </div>
                </DragDropContext>
                <div>
                <button onClick = {this.handleSubmit}> Submit </button>
                </div>
            </div>
            </div>
        )}
}

export default withRouter(withFirebase(RankPriorities));

