const options = [

    {
        value: "Avoid lessons before (Time) every day.",
        type: "AvoidBeforePriority" 
    },
    {
        value: "Avoid lessons after (Time) every day.",
        type: "AvoidAfterPriority"
    },
    {
        value: "Avoid lessons between (Time 1) and (Time 2) every day.",
        type: "FreePeriodPriority"
    },    
    {
        value: "Have a maximum number of free days.",
        type: "MaxFreeDaysPriority"
    },    
    {
        value: "Minimise travelling across campus.",
        type: "MinTravellingPriority"
    },    
    {
        value: "Minimise breaks between classes.",
        type: "MinBreaksPriority"
    },    
    {
        value: "Include a lunch break for (duration) every day.",
        type: "LunchBreakPriority"
    }
]

export default options