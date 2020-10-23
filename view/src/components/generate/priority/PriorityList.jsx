import React from 'react'
import {Droppable} from "react-beautiful-dnd";
import Priority from './Priority'
import './priorities.css';

const PriorityList = ({priorities, title, delPriority, toggleMH}) => {
    return (
        <Droppable droppableId={title}>
            {(provided) => {
                return(
                    <div
                        ref = {provided.innerRef}
                        {...provided.droppableProps}
                        className = {"droppable-col"}
                    >
                        {priorities.map((p, index) => {
                            return(
                                <Priority key = {p.id} p = {p} index = {index} delPriority = {delPriority} toggleMH = {toggleMH} />
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