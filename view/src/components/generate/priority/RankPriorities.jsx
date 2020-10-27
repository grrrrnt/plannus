import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../../firebase';
import {DragDropContext} from "react-beautiful-dnd";
import './priorities.css';
import {v4} from 'uuid';
import PriorityList from './PriorityList';
import AddPriority from './AddPriority';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import options from './options';


const fromDB = [
{
    id: v4(),
    type: "MinTravellingPriority",
    fields: {},
    rank: 1,
    mustHave: false,
},
{
    id: v4(),
    type: "AvoidBeforePriority",
    fields: {time: 1030},
    rank: 2,
    mustHave: true,
}, 
{
    id: v4(),
    type: "AvoidAfterPriority",
    fields: {time: 1400},
    rank: 3,
    mustHave: true,
}, 
{
    id: v4(),
    type: "FreePeriodPriority",
    fields: {fromTime: 911, toTime: 1411},
    rank: 4,
    mustHave: true,
}, 
{
    id: v4(),
    type: "MaxFreeDaysPriority",
    fields: {},
    rank: 5,
    mustHave: true,
},
{
    id: v4(),
    type: "MinBreaksPriority",
    fields: {},
    rank: 6,
    mustHave: true,
}, 
{
    id: v4(),
    type: "LunchBreakPriority",
    fields: {hours: 2},
    rank: 7,
    mustHave: true,
}];


/*
format of items
id: v4(),
    type: "LunchBreakPriority",
    name: "",
    fields: {hours: 2},
    rank: 7,
    mustHave: true,
}
*/

class RankPriorities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Priorities",
            items: [],
            loaded: false
        };
        
        this.addPriority = this.addPriority.bind(this);
        this.delPriority = this.delPriority.bind(this);
        this.toggleMH = this.toggleMH.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleSubmit  = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        var initItems = fromDB;
        for(var x of initItems) {
            for (var i of options) {
                if (x.type === i.type) {
                   var name = i.value;
                   if (x.type === 'AvoidBeforePriority' || x.type === 'AvoidAfterPriority') {
                        x.name = name.replace('(Time)', x.fields.time);
                    }

                    if (x.type === 'FreePeriodPriority') {
                        x.name = name.replace('(Time 1)', x.fields.fromTime);
                        x.name = x.name.replace('(Time 2)', x.fields.toTime);
                    }

                    if (x.type === 'LunchBreakPriority') {
                        x.name = name.replace('(duration)', x.fields.hours + " hours");
                    }

                    if (x.type === 'MaxFreeDaysPriority' || x.type === 'MinTravellingPriority' || x.type === 'MinBreaksPriority') {
                        x.name = name;
                    }
                } 
            }
        }
        this.setState({
            items: initItems,
            loaded: true,
        });
    }
/* format of priority
{
    name: 'Select a Priority',
    type: "",
    fields: {
        time: defaultDate,
        fromTime: defaultDate,
        toTime: defaultDate,
        hours: 0,
},  
 */
    addPriority(priority) {        
        const priorities = this.state.items;
        
        const duplicate = priorities.some(p => p.name === priority.name);
        
        if (duplicate) {
            alert("Priority was already selected.");
            return;
        }
        
        this.setState({
            items: [{
                id:v4(),
                type: priority.type,
                fields: priority.fields,
                name:priority.name,
                rank: 0,
                mustHave: false
                },
                ...this.state.items
            ],
        });
    }

    delPriority(index) {
        var updatedP = this.state.items;
        updatedP.splice(index, 1);
        this.setState({
            items: updatedP,
        });
    }

    toggleMH(index) {
        var updatedP = this.state.items;
        const isMustHave = updatedP[index].mustHave;
        if (isMustHave) {
            updatedP[index].mustHave = false;
        } else {
            updatedP[index].mustHave = true;
        }

        this.setState({
            items: updatedP,
        })
    }

    handleDragEnd(data) {
        const { source, destination } = data;
        if (!destination) {
            console.log("not dropped in droppable");
            return;
        }

        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            console.log("dropped in same place") 
            return; 
        }

        if (destination.index !== source.index && destination.droppableId === source.droppableId) {
            console.log("dropped in same place but different index")
        }

        //changing index of items if dropped into different index
        const pCopy = {...this.state.items[source.index]};
        var updatedState = this.state;
        updatedState.items.splice(source.index, 1);
        updatedState.items.splice(destination.index, 0, pCopy);
        this.setState(updatedState);
    }

    handleSubmit() {
        var toSubmit = this.state.items;
        for (var i = 0; i < toSubmit.length; i ++) {
            toSubmit[i].rank = i + 1;
            delete toSubmit[i].name;
        }

        console.log(toSubmit);
        /*
        var setUserPriorities = this.props.firebase.functions.httpsCallable('setUserPriorities');
        setUserPriorities({priorities: toSubmit}).then(function(result) {
            console.log(JSON.parse(JSON.stringify(result)));
        }).catch(function(err) {
            console.log(JSON.parse(JSON.stringify(err)));
        });
        */

    }

    

    render() {
        const { loaded, items, title } = this.state;
        return( 
            <div>
                <Grid container justify = "center">
                    <h2 className = {"title"}> What priorities are important to you?</h2>
                </Grid> 
                
                <AddPriority addPriority = {this.addPriority} />
                
                {
                    loaded ?
                    <div>  
                    <DragDropContext onDragEnd = {this.handleDragEnd}>
                        <Grid container justify = "center">
                        <h3 className = {"title"} > Drag to rank your priorities </h3>
                        </Grid>

                        <Grid container justify = "center">
                        <PriorityList priorities = {items} title = {title} delPriority = {this.delPriority} toggleMH = {this.toggleMH} />
                        </Grid>
                    </DragDropContext>
                    </div>
                    :
                    <div> loading ... </div>
                }

                <Grid container justify = "center">
                    <Button variant="outlined" color="primary" onClick = {this.handleSubmit}>
                        Submit
                    </Button>
                </Grid>

            </div>

    )}
}

export default withRouter(withFirebase(RankPriorities));




