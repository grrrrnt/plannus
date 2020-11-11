import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';


const Module = (props) => {
    return (
    <ListItem key={props.m.moduleCode} dense button onClick = {props.selectMod? props.selectMod : undefined} style={props.style? props.style : undefined} >
                            <ListItemText primary={props.m.moduleCode} secondary={props.m.title} />
                            {
                                props.delMod ?
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={props.delMod}>
                                            <ClearIcon fontSize="default" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                : <div></div>
                            }
                        </ListItem>
    );
}

export default Module