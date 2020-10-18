import React from 'react'
import {Draggable} from "react-beautiful-dnd";
import './priorities.css';


const Priority = ({ el, index, deletePriority, toggleStarPriority }) => {
    return(
        <Draggable index = {index} draggableId = {el.id}>
            {(provided, snapshot) => {
                return(
                    <div
                        className = {`item ${snapshot.isDropAnimating && "drop-animating"}`}
                        ref = {provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <button onClick = {(e) => deletePriority(index)}> X </button>
                        <button onClick = {(e) => toggleStarPriority(index)}> {el.mustHave} </button>
                        {el.name}
                    </div>
                )
            }} 
        </Draggable>
    )
}

export default Priority