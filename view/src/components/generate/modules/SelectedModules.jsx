import React from "react";
import List from '@material-ui/core/List';
import Module from "./Module"

const SelectedModules = ({ mods, delMod }) => {
    return (
        <List style={{ width: "100%", maxHeight: "300px", overflow: "auto" }}>
            {
                mods.map((m, index) => {
                    return (
                        <Module m = {m} delMod={() => delMod(index)}/>
                    )
                })
            }
        </List>
    )
}

export default SelectedModules