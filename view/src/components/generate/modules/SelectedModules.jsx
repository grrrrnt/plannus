import React from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const SelectedModules = ({ mods, delMod }) => {
    return (
        <List style={{ width: "100%" }}>
            {
                mods.map((m, index) => {
                    return (
                        <ListItem key={m.moduleCode} dense button >
                            <ListItemText primary={m.moduleCode} secondary={m.title} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => delMod(index)}>
                                    <ClearIcon fontSize="default" />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })
            }
        </List>
    )
}

export default SelectedModules