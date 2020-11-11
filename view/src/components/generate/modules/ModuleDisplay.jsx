import React from "react";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Module from "./Module"


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
                                    <Module m={m} selectMod = {() => selectMod(m)} style={style} />
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