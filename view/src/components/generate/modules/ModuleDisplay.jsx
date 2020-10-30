import React from "react";
import LazyLoad from 'react-lazyload';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';



/*
class ModuleDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modules: this.props.modules,
        };
    }

    render() {
        var { modules } = this.state;

        return (
            <div>
            {
                modules.map(m => {
                    return (
                        <Module key={m.moduleCode} moduleCode={m.moduleCode} title={m.title} />
                    )
                })
            }
            </div>
        );
    }
}
*/

const Loading = () => (
    <div> loading ...</div>
);

const ModuleDisplay = ({ modules, selectMod }) => {
    return (
        <List>
            {
                modules.map(m=> {
                    return(             
                        <LazyLoad key = {m.moduleCode} placeholder = {<Loading/>}>
                            <ListItem key = {m.moduleCode} dense button onClick = {()=>selectMod(m)}>
                                <ListItemText primary={m.moduleCode} secondary={m.title} />
                            </ListItem>  
                        </LazyLoad>     
                    )
                })
            }
        </List>
    );
}

export default ModuleDisplay