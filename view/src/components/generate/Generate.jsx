import React, { Component } from "react";
import { withFirebase } from "../firebase"
import SelectSemester from "./semester/SelectSemester";
import RankPriorities from "./priority/RankPriorities";
import SelectModules from "./modules/SelectModules"
import SelectTimetables from "./SelectTimetables"
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

class Generate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sem: "",
            allModules: [],
            priorities: [],
            selectedModules: [],
            priorityFetched: false,
            activeStep: 0,
            steps: ['Select Semester', 'Rank Priorities', 'Select Modules', 'Select Timetables'],
        }

        this.setActiveStep = this.setActiveStep.bind(this);
        this.getStepContent = this.getStepContent.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.setPriorities = this.setPriorities.bind(this);
        this.setMods = this.setMods.bind(this);
        this.setSem = this.setSem.bind(this);
        this.setAllModules = this.setAllModules.bind(this);
        this.setFetchedPriority = this.setFetchedPriority.bind(this);
    }

    setAllModules(modules) {
        this.setState({
            allModules: modules,
        })
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
                selectedModules: [],
                allModules: [],
            })
        }
    }

    setMods(mods) {
        this.setState({
            selectedModules: mods,
        });
    }

    setFetchedPriority() {
        this.setState({ priorityFetched: true });
    }

    getStepContent = (step) => {
        switch (step) {
            case 0:
                return <SelectSemester nextStep={this.handleNext} init={this.state.sem} setSem={this.setSem} />
            case 1:
                return <RankPriorities nextStep={this.handleNext} init={this.state.priorities} setPriorities={this.setPriorities} priorityFetched={this.state.priorityFetched} setFetchedPriority={this.setFetchedPriority} />
            case 2:
                return <SelectModules nextStep={this.handleNext} sem={this.state.sem} init={this.state.selectedModules} setMods={this.setMods} allModules={this.state.allModules} setAllModules={this.setAllModules} />
            case 3:
                return <SelectTimetables mods={this.state.selectedModules} priorities={this.state.priorities} />
            default:
                return
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


    render() {
        const { activeStep, steps } = this.state;
        return (
            <div>
                <Grid container justify="center">
                    <h1> Generate Timetables</h1>
                </Grid>

                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
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
            </div>
        )
    }
}

export default withFirebase(Generate);