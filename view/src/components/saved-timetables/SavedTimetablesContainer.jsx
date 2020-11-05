import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import SavedTimetables from "./SavedTimetables"
import SubscribedTimetables from "./SubscribedTimetables"
import "./SavedTimetables.scss"

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            className="saved-timetables-tab-panels"
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            <Box p={3}>
                {children}
            </Box>
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default function SavedTimetablesContainer() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="saved-timetables-container">
            <Tabs
            variant="fullWidth"
                orientation="vertical"
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                className="saved-timetables-tabs"
            >
                <Tab label="Saved Timetables" />
                <Tab label="Subscribed Timetables" />
            </Tabs>
            <TabPanel value={value} index={0}>
                <SavedTimetables />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SubscribedTimetables />
            </TabPanel>
        </div>
    );
}
