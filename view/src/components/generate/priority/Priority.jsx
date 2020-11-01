import React from 'react'
import { Draggable } from "react-beautiful-dnd";
import './priorities.css';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

const Priority = ({ p, index, delPriority, toggleMH }) => {
    return (
        <Draggable index={index} draggableId={p.id}>
            {(provided, snapshot) => {
                return (
                    <div
                        className={"item"}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Tooltip title="Delete">
                            <IconButton size="small" edge="start" onClick={(e) => delPriority(index)} >
                                <DeleteIcon fontSize="default" />
                            </IconButton>
                        </Tooltip>
                        {
                            p.mustHave ?
                                <Tooltip title="Must-Have">
                                    <IconButton size="small" onClick={(e) => toggleMH(index)} >
                                        <StarIcon fontSize="default" />
                                    </IconButton>
                                </Tooltip>
                                :
                                <Tooltip title="Must-Have">
                                    <IconButton size="small" onClick={(e) => toggleMH(index)} >
                                        <StarBorderIcon fontSize="default" />
                                    </IconButton>
                                </Tooltip>
                        }
                        <span>{p.name}</span>
                    </div>
                )
            }}
        </Draggable>
    )
}
export default Priority