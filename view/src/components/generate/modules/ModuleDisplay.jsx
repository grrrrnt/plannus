import React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const ModuleDisplay = ({ className, modules, selectMod }) => {
    return (
        <div className={className}>
            <AutoSizer>
                {({ height, width }) => (
                    <FixedSizeList
                        height={height}
                        itemCount={modules.length}
                        itemSize={height / 8}
                        width={width}
                    >
                        {
                            ({ index, style }) => {
                                const m = modules[index]
                                return (
                                    <ListItem className="module-display-list-item" key={m.moduleCode} dense button onClick={() => selectMod(m)} style={style} >
                                        <ListItemText primary={m.moduleCode} secondary={m.title} />
                                    </ListItem>
                                )
                            }
                        }
                    </FixedSizeList>
                )}
            </AutoSizer>
        </div >
    );
}

export default ModuleDisplay