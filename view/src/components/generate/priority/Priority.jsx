import React from 'react'
import {Draggable} from "react-beautiful-dnd";
import './priorities.css';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
/*
format:
                id:v4(),
                type: priority.type,
                fields: priority.fields,
                name:priority.name,
                rank: 0,
                mustHave: false
*/

const Priority = ({ p, index, delPriority, toggleMH }) => {
    return(
        <Draggable index = {index} draggableId = {p.id}>
            {(provided, snapshot) => {
                return(
                    <div
                        className = {"item"}
                        ref = {provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <DeleteIcon fontSize="small" onClick = {(e) => delPriority(index)} />
                        {
                            p.mustHave ? 
                                <StarIcon fontSize="small" onClick = {(e) => toggleMH(index)} />
                            :   
                                <StarBorderIcon fontSize="small" onClick = {(e) => toggleMH(index)} />
                        }
                    {p.name}
                    </div>
                )
            }} 
        </Draggable>
    )
}
export default Priority