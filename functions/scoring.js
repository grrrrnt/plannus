exports.scoring = (priorities, timetable) => {
    let score = 0;
    const length = priorities.length;
    for (let p = 0; p < length; p++) {
        score += getScore(length, priorities[p], timetable);
    }
    return score;
}

function getScore(count, priority, timetable) {
    let multiplier = 0;
    const rank = priority.rank;
    switch(priority.type) {
        case "AvoidAfterPriority":
            const afterTime = priority.fields.time;
            multiplier = avoidLessonsAfterPriorityMultiplier(rank, afterTime, timetable);
            break;
        case "AvoidBeforePriority":
            const beforeTime = priority.fields.time;
            multiplier = avoidLessonsBeforePriorityMultiplier(rank, beforeTime, timetable);
            break;
        case "FreePeriodPriority":
            const fromTime = priority.fields.fromTime;
            const toTime = priority.fields.toTime;
            multiplier = freePeriodPriorityMultiplier(rank, fromTime, toTime, timetable);
            break;
        case "LunchBreakPriority":
            const hours = priority.fields.hours;
            multiplier = lunchBreakPriorityMultiplier(rank, hours, timetable);
            break;
        case "MaxFreeDaysPriority":
            multiplier = maxFreeDaysPriorityMultiplier(rank, timetable);
            break;
        case "MinBreaksPriority":
            multiplier = minBreaksPriorityMultiplier(rank, timetable);
            break;
        case "MinTravellingPriority":
            multiplier = minTravellingPriorityMultiplier(rank, timetable);
    }
    return calculateScore(count, rank, multiplier);
}

function calculateScore(count, rank, multiplier) {
    const max = count + 1 - rank;
    return multiplier * max;
}

function avoidLessonsAfterPriorityMultiplier(rank, time, timetable) {
    let multiplier = 1;
    for (let day = 0; day <= 4; day++) {
        for (let e = 0; e < timetable.length; e++) {
            if (timetable[e].endTime > time && timetable[e].day === day) {
                multiplier = multiplier - 0.2;
                break;
            }
        }
    }
    return multiplier;
}

function avoidLessonsBeforePriorityMultiplier(rank, time, timetable) {
    let multiplier = 1;
    for (let day = 0; day <= 4; day++) {
        for (let e = 0; e < timetable.length; e++) {
            if (timetable[e].startTime < time && timetable[e].day === day) {
                multiplier = multiplier - 0.2;
                break;
            }
        }
    }
    return multiplier;
}

function freePeriodPriorityMultiplier(rank, fromTime, toTime, timetable) {
    let multiplier = 1;
    for (let day = 0; day <= 4; day++) {
        for (let e = 0; e < timetable.length; e++) {
            if (timetable[e].day === day && timetable[e].startTime < toTime && timetable[e].endTime > fromTime) {
                multiplier = multiplier - 0.2;
                break;
            }
        }
    }
    return multiplier;
}

function lunchBreakPriorityMultiplier(rank, hours, timetable) {
    let multiplier = 1;
    let isFree = false;
    for (let day = 0; day <= 4; day++) {
        for (let from = 10; from + hours <= 15; from++) {
            if (isFree) { break; } else {
                for (let e = 0; e < timetable.length; e++) {
                    if (timetable[e].day !== day) { continue; }
                    if (timetable[e].events.startTime < (from + hours) * 60 && timetable[e].events.endTime > from * 60) { break; }
                    isFree = true;
                }
            }
        }
        if (!isFree) { multiplier = multiplier - 0.2; }
    }
    return multiplier;
}

function maxFreeDaysPriorityMultiplier(rank, timetable) {
    let multiplier = 1;
    return multiplier;
}

function minBreaksPriorityMultiplier(rank, timetable) {
    let multiplier = 1;
    return multiplier;
}

function minTravellingPriorityMultiplier(rank, timetable) {
    let multiplier = 1;
    return multiplier;
}