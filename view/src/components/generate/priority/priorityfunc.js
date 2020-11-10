export const defaultDate = new Date('2014-08-18T21:11:54');

export const defaultFields = {
    time: defaultDate,
    fromTime: defaultDate,
    toTime: defaultDate,
    hours: "1",
};

export const options = [

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

export const durationOp = ['1', '2', '3', '4'];

export const reformatForSub = (arr) => {
    for (var i = 0; i < arr.length; i++) {
        arr[i].rank = i + 1;
    }
    return arr;
}

export const reformatForAdd = (priority, fields) => {
    if (priority.type === 'FreePeriodPriority') {
        priority.fields = {
            toTime: parseInt(fields.toTime.getHours() + "" + (fields.toTime.getMinutes() < 10 ? '0' : '') + fields.toTime.getMinutes()),
            fromTime: parseInt(fields.fromTime.getHours() + "" + (fields.fromTime.getMinutes() < 10 ? '0' : '') + fields.fromTime.getMinutes())
        }

        priority.name = priority.name.replace('(Time 1)', priority.fields.fromTime);
        priority.name = priority.name.replace('(Time 2)', priority.fields.toTime);

    } else if (priority.type === 'AvoidBeforePriority' || priority.type === 'AvoidAfterPriority') {
        priority.fields = {
            time: parseInt(fields.time.getHours() + "" + (fields.time.getMinutes() < 10 ? '0' : '') + fields.time.getMinutes())
        }

        priority.name = priority.name.replace('(Time)', priority.fields.time);

    } else if (priority.type === 'LunchBreakPriority') {
        priority.fields = {
            hours: parseInt(fields.hours),
        }

        priority.name = priority.name.replace('(duration)', priority.fields.hours + " hour(s)");

    } else {
        priority.fields = {};
    }
}
