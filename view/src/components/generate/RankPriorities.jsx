import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../firebase';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import './priorities.css';
import {v4} from 'uuid';


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
        this.addItem = this.addItem.bind(this);
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
                },
            ...this.state.items
            ],
            input:"",
        });
       
    }

    handleChange(e) {
        this.setState({
            input: e.target.value,
        })
    }

    render() {
        return (
            <div className = {"rank-priorities"}>
                <div>
                    <input type="text" onChange={this.handleChange}/> 
                    <button onClick = {this.addItem}> Add Priority</button>  
                </div>
                <DragDropContext onDragEnd = {this.handleDragEnd}>
                    <div className = {"column"}>
                        <h3>Rank your priorities</h3>
                        <Droppable droppableId={this.state.title}>  
                            {(provided) => {
                                return(
                                    <div
                                        ref = {provided.innerRef}
                                        {...provided.droppableProps}
                                        className = {"droppable-col"}
                                    >
                                        {this.state.items.map((el, index) => {
                                            return(
                                                <Draggable key = {el.id} index = {index} draggableId = {el.id}>
                                                    {(provided) => {
                                                        return(
                                                            <div
                                                                className = {"item"}
                                                                ref = {provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                {el.name}
                                                            </div>
                                                        )
                                                    }}
                                                </Draggable>
                                            )  
                                            })}
                                            {provided.placeholder}
                                    </div>
                                )
                            }}
                        </Droppable>
                    </div>
                </DragDropContext>
            </div>
        )}
}

export default withRouter(withFirebase(RankPriorities));

