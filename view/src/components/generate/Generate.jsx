import React, { Component } from "react";
import { withAuthenticationConsumer } from "../authentication"
import { withFirebase } from "../firebase"
import SelectSemester from "./SelectSemester";
import RankPriorities from "./priority/RankPriorities";
import SelectModules from "./modules/SelectModules"
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';



/*
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
    
*/


class Generate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sem: "",
            allModules: [],
            priorities: [],
            selectedModules:[],
            activeStep: 0, 
            steps: ['Select Semester', 'Rank Priorities', 'Select Modules', 'Select Timetables'], 
        }   

        this.setActiveStep = this.setActiveStep.bind(this);
        this.getStepContent = this.getStepContent.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.setPriorities = this.setPriorities.bind(this);
        this.setSem = this.setSem.bind(this);
        this.setMods = this.setMods.bind(this);
    }
    
    setPriorities(priorities) {
        this.setState({
            priorities: priorities
        });
    }

    setSem(s) {
        if (s !== this.state.sem) {
            this.setState({
                sem: s,
                selectedModules: []
            })
        }
        
        
        //const year = s.split(" ")[0];
        //const semester = s.split(" ")[1];
    }

    setMods(mods) {
        this.setState({
            selectedModules: mods,
        });
    }
    
    getStepContent = (step) => {
        switch(step) {
            case 0:
                return <SelectSemester nextStep = {this.handleNext} setSem = {this.setSem} sem = {this.state.sem} />
            case 1:
                return <RankPriorities nextStep = {this.handleNext} priorities = {this.state.priorities} setPriorities = {this.setPriorities} />
            case 2:
                return <SelectModules nextStep = {this.handleNext} sem = {this.state.sem} mods = {this.state.selectedModules} setMods = {this.setMods}  />
            case 3:
                return <div> select timetable</div>
    
        }
    }
    
    setActiveStep(step) {
        this.setState({
            activeStep: step,
        });
    }

    handleNext = () => {
        this.setActiveStep(this.state.activeStep + 1);
    };
    
    handleBack = () => {
        this.setActiveStep(this.state.activeStep - 1);
    };
    
    handleReset = () => {
        this.setActiveStep(0);
    };
    
    componentDidMount() {
        if (!this.props.authUser) {
            this.props.firebase.loginAnonymously()
        }
    }

    render() {
        const {activeStep, steps} = this.state;
        return (
            <div>
                <Grid container justify = "center">
                <h1 className = {"title"}> Generate Timetables</h1>
                </Grid>
            
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper>
                
                <div>
                {activeStep === steps.length ? (
                    <div>
                        <Typography> All steps completed </Typography>
                        <Button onClick={this.handleReset}>Reset</Button>
                    </div>
                    ) : (
                    <div>
                        {this.getStepContent(activeStep)}
                        <div>
                        <Button
                            disabled={activeStep === 0}
                            onClick={this.handleBack}
                        >
                            Back
                        </Button>
                        </div>
                    </div>
                )}
                </div>
             </div>
        )
    }
}

export default withAuthenticationConsumer(withFirebase(Generate));