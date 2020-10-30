import React from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

/*
class SelectedModules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modules: this.props.selected,
        
        };

    }


    
    render() {
        const { modules } = this.state;
        return (
            <div>
                <h4 style= {{fontFamily: "Arial, Helvetica, sans-serif",
                                color: "DimGray"}} >
                    Selected Modules
                </h4>
                {
                    modules.map( (m, ind) => {
                            return (
                                <SelectedModule key = {m.moduleCode} index = {ind} module = {m} delMod = {this.props.delMod} />
                            )
                        })
                }
            </div>
        )
    }
}
*/
const SelectedModules = ({mods, delMod}) => {
    return (
        <List>
            {
                mods.map((m, index) => {
                    return(             
                        <ListItem key = {m.moduleCode} dense button >
                            <ListItemText primary={m.moduleCode} secondary={m.title} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick = {() => delMod(index)}>
                                    <ClearIcon fontsize="medium" />
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