import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../../firebase';
import {DragDropContext} from "react-beautiful-dnd";
import './priorities.css';
import {v4} from 'uuid';
import PriorityList from './PriorityList'
import AddPriority from './AddPriority'


const item = {
    id: v4(),
    name: "more free days",
    mustHave: "1",
}

const item2 = {
    id: v4(),
    name: "free after 2pm",
    mustHave: "1",
}

const item3 = {
    id: v4(),
    name: "free after 3pm",
    mustHave: "0",
}


const item4 = {
    id: v4(),
    name: "free after 5pm",
    mustHave: "0",
}


class RankPriorities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Priorities",
            items: [item, item2, item3, item4],
            input: "",
        };

        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deletePriority = this.deletePriority.bind(this);
        this.addItem = this.addItem.bind(this);
        this.addPriority = this.addPriority.bind(this);
        this.toggleStarPriority = this.toggleStarPriority.bind(this);
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

    addItem(e) {
        this.setState({
            items: [{
                id: v4(),
                name: this.state.input,
                mustHave: "0",
                },
            ...this.state.items
            ],
            input:"",
        });
       
    }

    addPriority(name) {
        this.setState({
            items: [{
                id: v4(),
                name: name,
                mustHave: "0",
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

    render() {
        return (
            <div className = {"rank-priorities"}>
                <div>
                    <AddPriority addPriority = {this.addPriority} />
                </div>
                <div>
                    <input type="text" value={this.state.input} onChange={this.handleChange}/> 
                    <button onClick = {this.addItem}> Add Priority</button>  
                </div>
                <DragDropContext onDragEnd = {this.handleDragEnd}>
                    <div className = {"column"}>
                        <h3>Drag to rank your priorities</h3>
                        <PriorityList priorities = {this.state.items} title = {this.state.title} deletePriority = {this.deletePriority} toggleStarPriority = {this.toggleStarPriority} />
                    </div>
                </DragDropContext>
            </div>
        )}
}

export default withRouter(withFirebase(RankPriorities));

