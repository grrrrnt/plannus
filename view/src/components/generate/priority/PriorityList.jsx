import React from 'react'
import {Droppable} from "react-beautiful-dnd";
import Priority from './Priority'
import './priorities.css';

const PriorityList = ({priorities, title, deletePriority, toggleStarPriority}) => {
    return (
        <Droppable droppableId={title}>  
            {(provided) => {
                return(
                    <div
                        ref = {provided.innerRef}
                        {...provided.droppableProps}
                        className = {"droppable-col"}
                    >
                        {priorities.map((el, index) => {
                            return(
                                <Priority key = {el.id} el = {el} index = {index} deletePriority = {deletePriority} toggleStarPriority = {toggleStarPriority} />
                            )  
                            })}
                            {provided.placeholder}
                    </div>
                )
            }}
        </Droppable>
    )
}

export default PriorityList