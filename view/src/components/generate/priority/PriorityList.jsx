import React from 'react'
import { Droppable } from "react-beautiful-dnd";
import { DragDropContext } from "react-beautiful-dnd";
import Grid from '@material-ui/core/Grid';
import Priority from './Priority'
import './priorities.css';

const PriorityList = ({ priorities, title, delPriority, toggleMH, handleDragEnd }) => {
    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
        >
            <h3 style={{ whiteSpace: "pre-wrap" }} >
                Drag to rank your priorities {"\n"}
            </h3>
            <DragDropContext onDragEnd={(data) => handleDragEnd(data)}>
                <Droppable droppableId={title}>
                    {(provided) => {
                        return (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={"droppable-col"}
                            >
                                {priorities.map((p, index) => {
                                    return (<Priority key={p.id} p={p} index={index} delPriority={delPriority} toggleMH={toggleMH} />)
                                })}
                                {provided.placeholder}
                            </div>
                        )
                    }}
                </Droppable>
            </DragDropContext>
        </Grid>

    )
}

export default PriorityList