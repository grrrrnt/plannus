exports.scoring = (priorities, timetable, minMaxValues) => {
    let score = 0;
    let max = 0;
    const length = priorities.length;
    for (let p = 0; p < length; p++) {
        score += getScore(length, priorities[p], timetable, minMaxValues);
        max += p+1;
    }
    return score / max * 100;
}

exports.getMinMaxValues = (priorities, timetables) => {
    const SAMPLE_PERIOD = 10;

    let maxPossibleFreeDays = 0;
    let minPossibleDist = Number.MAX_SAFE_INTEGER;
    let maxPossibleDist = 0;
    let minPossibleHours = Number.MAX_SAFE_INTEGER;
    let maxPossibleHours = 0;

    let dist;
    let maxDays;
    let hours;

    for (let t = 0; t < timetables.length; t+=SAMPLE_PERIOD) {
        maxDays = findMaxFreeDays(timetables[t]);
        if (maxDays > maxPossibleFreeDays) {
            maxPossibleFreeDays = maxDays;
        }

        hours = findHoursOfBreaks(timetables[t]);
        if (hours < minPossibleHours) {
            minPossibleHours = hours;
        }
        if (hours > maxPossibleHours) {
            maxPossibleHours = hours;
        }

        dist = findDistance(timetables[t]);
        if (dist < minPossibleDist) {
            minPossibleDist = dist;
        }
        if (dist > maxPossibleDist) {
            maxPossibleDist = dist;
        }
    }

    return {
        maxPossibleFreeDays: maxPossibleFreeDays,
        minPossibleDist: minPossibleDist,
        maxPossibleDist: maxPossibleDist,
        minPossibleHours: minPossibleHours,
        maxPossibleHours: maxPossibleHours
    }
}

function getScore(count, priority, timetable, minMaxValues) {
    let multiplier = 0;
    const rank = priority.rank;
    switch(priority.type) {
        case "AvoidAfterPriority":
            const afterTime = priority.fields.time;
            multiplier = avoidLessonsAfterPriorityMultiplier(afterTime, timetable);
            break;
        case "AvoidBeforePriority":
            const beforeTime = priority.fields.time;
            multiplier = avoidLessonsBeforePriorityMultiplier(beforeTime, timetable);
            break;
        case "FreePeriodPriority":
            const fromTime = priority.fields.fromTime;
            const toTime = priority.fields.toTime;
            multiplier = freePeriodPriorityMultiplier(fromTime, toTime, timetable);
            break;
        case "LunchBreakPriority":
            const hours = priority.fields.hours;
            multiplier = lunchBreakPriorityMultiplier(hours, timetable);
            break;
        case "MaxFreeDaysPriority":
            const maxPossibleFreeDays = minMaxValues.maxPossibleFreeDays;
            multiplier = maxFreeDaysPriorityMultiplier(timetable, maxPossibleFreeDays);
            break;
        case "MinBreaksPriority":
            const minPossibleHours = minMaxValues.minPossibleHours;
            const maxPossibleHours = minMaxValues.maxPossibleHours;
            multiplier = minBreaksPriorityMultiplier(timetable, minPossibleHours, maxPossibleHours);
            break;
        case "MinTravellingPriority":
            const minPossibleDist = minMaxValues.minPossibleDist;
            const maxPossibleDist = minMaxValues.minPossibleDist;
            multiplier = minTravellingPriorityMultiplier(timetable, minPossibleDist, maxPossibleDist);
    }
    return calculateScore(count, rank, multiplier);
}

function calculateScore(count, rank, multiplier) {
    const max = count + 1 - rank;
    return multiplier * max;
}

function avoidLessonsAfterPriorityMultiplier(time, timetable) {
    let multiplier = 1;
    for (let day = 0; day <= 4; day++) {
        for (let e = 0; e < timetable.events.length; e++) {
            if (timetable.events[e].endTime > time && timetable.events[e].day === day) {
                multiplier = multiplier - 0.2;
                break;
            }
        }
    }
    return multiplier;
}

function avoidLessonsBeforePriorityMultiplier(time, timetable) {
    let multiplier = 1;
    for (let day = 0; day <= 4; day++) {
        for (let e = 0; e < timetable.events.length; e++) {
            if (timetable.events[e].startTime < time && timetable.events[e].day === day) {
                multiplier = multiplier - 0.2;
                break;
            }
        }
    }
    return multiplier;
}

function freePeriodPriorityMultiplier(fromTime, toTime, timetable) {
    let multiplier = 1;
    for (let day = 0; day <= 4; day++) {
        for (let e = 0; e < timetable.events.length; e++) {
            if (timetable.events[e].day === day && timetable.events[e].startTime < toTime && timetable.events[e].endTime > fromTime) {
                multiplier = multiplier - 0.2;
                break;
            }
        }
    }
    return multiplier;
}

function lunchBreakPriorityMultiplier(hours, timetable) {
    let multiplier = 1;
    let isFree = false;
    for (let day = 0; day <= 4; day++) {
        for (let from = 10; from + hours <= 15; from++) {
            if (isFree) { break; } else {
                for (let e = 0; e < timetable.events.length; e++) {
                    if (timetable.events[e].day !== day) { continue; }
                    if (timetable.events[e].startTime < (from + hours) * 60 && timetable.events[e].endTime > from * 60) { break; }
                    isFree = true;
                }
            }
        }
        if (!isFree) { multiplier = multiplier - 0.2; }
    }
    return multiplier;
}

function maxFreeDaysPriorityMultiplier(timetable, maxPossibleFreeDays) {
    let multiplier = 1;
    if (maxPossibleFreeDays !== 0) {
        const maxFreeDays = findMaxFreeDays(timetable);
        multiplier = maxFreeDays / maxPossibleFreeDays;
    }
    return multiplier;
}

function minBreaksPriorityMultiplier(timetable, minPossibleHours, maxPossibleHours) {
    let multiplier = 1;
    if (minPossibleHours !== maxPossibleHours) {
        const hoursOfBreaks = findHoursOfBreaks(timetable);
        multiplier = (maxPossibleHours - hoursOfBreaks) / (maxPossibleHours - minPossibleHours);
    }
    return multiplier;
}

function minTravellingPriorityMultiplier(timetable, minPossibleDist, maxPossibleDist) {
    let multiplier = 1;
    if (maxPossibleDist - minPossibleDist >= 1) {
        const dist = findDistance(timetable);
        multiplier = (maxPossibleDist - dist) / (maxPossibleDist - minPossibleDist);
    }
    return multiplier;
}

function findMaxFreeDays(timetable) {
    let maxFreeDays = 5;
    for (let day = 0; day <= 4; day++) {
        for (let e = 0; e < timetable.events.length; e++) {
            if (timetable.events[e].day === day) {
                maxFreeDays--;
                break;
            }
        }
    }
    return maxFreeDays;
}

function findHoursOfBreaks(timetable) {
    let hoursOfBreaks = 0;
    let prevDay = timetable.events[0].day;
    let prevEndTime = timetable.events[0].endTime;

    for (let e = 0; e < timetable.events.length; e++) {
        if (timetable.events[e].day === prevDay) {
            if (timetable.events[e].startTime > prevEndTime) {
                hoursOfBreaks += (timetable.events[e].startTime - prevEndTime)/60;
            }

            prevEndTime = timetable.events[e].endTime;
        } else {
            prevDay = timetable.events[e].day;
            prevEndTime = timetable.events[e].endTime;
        }
    }

    return hoursOfBreaks;
}

function findDistance(timetable) {
    let totalDist = 0;
    let prevDay = timetable.events[0].day;
    let prevLocation = findStartingLocationOfDay(timetable, 0);

    for (let day = 0; day <= 4; day++) {
        for (let e = 0; e < timetable.events.length; e++) {
            if (timetable.events[0].day === prevDay) {
                const thisLocation = timetable.events[0].location;
                totalDist += getDistanceBetween(prevLocation, thisLocation);
                prevLocation = thisLocation;
            } else {
                prevDay = timetable.events[0].day;
                prevLocation = findStartingLocationOfDay(timetable, day);
            }
        }
    }
    return totalDist;
}

function findStartingLocationOfDay(timetable, day) {
    let startingLocation = timetable.events[0].location;
    for (let e = 0; e < timetable.events.length; e++) {
        if (timetable.events[0].day === day) {
            startingLocation = timetable.events[0].location;
            break;
        }
    }
    return startingLocation;
}

function getDistanceBetween(start, dest) {
    const distances = [[0, 457, 520.9], [390.9, 0, 404.7], [503.2, 471.5, 0]];
    const maxDist = 520.9;
    const UNKNOWN = -1;

    const startIndex = getDistanceIndex(start);
    const destIndex = getDistanceIndex(dest);

    if (startIndex === UNKNOWN || destIndex === UNKNOWN) {
        return maxDist;
    } else {
        return distances[startIndex][destIndex];
    }
}

function getDistanceIndex(location) {
    const locationCode = location.substring(0, 3);
    switch (locationCode) {
        case "UT-":
            return 0;
        case "ERC":
            return 0;
        case "TP-":
            return 0;
        case "COM":
            return 2;
        default:
            return -1;
    }
}