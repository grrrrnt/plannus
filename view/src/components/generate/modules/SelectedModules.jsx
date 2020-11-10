import React from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const SelectedModules = ({ mods, delMod }) => {
    return (
        <List style={{ width: "100%", maxHeight: "300px", overflow: "auto" }}>
            {
                mods.map((m, index) => {
                    return (
                        <ListItem key={m.moduleCode} dense button >
                            <ListItemText primary={m.moduleCode} secondary={m.title} />
                            {
                                delMod ?
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => delMod(index)}>
                                            <ClearIcon fontSize="default" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                : <div></div>
                            }
                        </ListItem>
                    )
                })
            }
        </List>
    )
}

export default SelectedModules