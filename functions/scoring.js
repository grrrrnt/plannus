exports.scoring = (priorities, timetable, minMaxValues) => {
    if (timetable.events.length === 0) { return 0; }
    let score = 0;
    let max = 0;
    const length = priorities.length;
    for (let p = 0; p < length; p++) {
        score += getScore(length, priorities[p], timetable, minMaxValues);
        max += p+1;
    }
    return score / max * 100;
}

exports.checkMustHaveFulfilled = (priorities, timetable, minMaxValues) => {
    let fulfilled = true;
    for (let p = 0; p < priorities.length; p++) {
        if (priorities[p].mustHave) {
            let multiplier = 0;
            switch(priorities[p].type) {
                case "AvoidAfterPriority":
                    const afterTime = priorities[p].fields.time;
                    multiplier = avoidLessonsAfterPriorityMultiplier(afterTime, timetable);
                    break;
                case "AvoidBeforePriority":
                    const beforeTime = priorities[p].fields.time;
                    multiplier = avoidLessonsBeforePriorityMultiplier(beforeTime, timetable);
                    break;
                case "FreePeriodPriority":
                    const fromTime = priorities[p].fields.fromTime;
                    const toTime = priorities[p].fields.toTime;
                    multiplier = freePeriodPriorityMultiplier(fromTime, toTime, timetable);
                    break;
                case "LunchBreakPriority":
                    const hours = priorities[p].fields.hours;
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
            fulfilled = (multiplier === 1);
        }
        if (!fulfilled) { break; }
    }
    return fulfilled;
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

function toMinutes(time) {
    return parseInt(time.toString().slice(0, 2)) * 60 + parseInt(time.toString().slice(2));
}

function avoidLessonsAfterPriorityMultiplier(time, timetable) {
    const timeInMin = toMinutes(time);
    let multiplier = 1;
    for (let day = 0; day <= 4; day++) {
        for (let e = 0; e < timetable.events.length; e++) {
            if (timetable.events[e].endTime > timeInMin && timetable.events[e].day === day) {
                multiplier = multiplier - 0.2;
                break;
            }
        }
    }
    return multiplier;
}

function avoidLessonsBeforePriorityMultiplier(time, timetable) {
    const timeInMin = toMinutes(time);
    let multiplier = 1;
    for (let day = 0; day <= 4; day++) {
        for (let e = 0; e < timetable.events.length; e++) {
            if (timetable.events[e].startTime < timeInMin && timetable.events[e].day === day) {
                multiplier = multiplier - 0.2;
                break;
            }
        }
    }
    return multiplier;
}

function freePeriodPriorityMultiplier(fromTime, toTime, timetable) {
    const fromTimeInMin = toMinutes(fromTime);
    const toTimeInMin = toMinutes(toTime);
    let multiplier = 1;
    for (let day = 0; day <= 4; day++) {
        for (let e = 0; e < timetable.events.length; e++) {
            if (timetable.events[e].day === day && timetable.events[e].startTime < toTimeInMin && timetable.events[e].endTime > fromTimeInMin) {
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
        isFree = true;
        for (let from = 10; from + hours <= 15; from++) {
            for (let e = 0; e < timetable.events.length - 1; e++) {
                if (timetable.events[e].day !== day) { continue; }
                if (timetable.events[e].day !== timetable.events[e+1].day) { continue; }
                if (timetable.events[e].endTime > from * 60 && timetable.events[e+1].startTime < (from + hours) * 60) {
                    isFree = false;
                    break;
                }
            }
            if (isFree) { break; }
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
    if (timetable.events.length === 0) { return 0; }
    let hoursOfBreaks = 0;
    let prevDay = timetable.events[0].day;
    let prevEndTime = timetable.events[0].endTime;

    for (let e = 0; e < timetable.events.length; e++) {
        if (timetable.events[e].day === prevDay) {
            if (timetable.events[e].startTime > prevEndTime) {
                hoursOfBreaks += (toMinutes(timetable.events[e].startTime) - toMinutes(prevEndTime))/60;
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
    if (timetable.events.length === 0) { return 0; }
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
    const distances = [[  0, 1.7, 0.9, 1.3, 1.6, 2.1, 2.3, 0.7, 1.7, 1.2, 7.4, 0.6,   0, 1.5, 2.5],
                       [1.7,   0,   1, 0.5, 1.7, 0.3, 0.5, 1.2, 1.8, 1.3, 8.2,   2, 1.7, 0.4, 0.7],
                       [0.9,   1,   0, 0.5, 1.3, 1.3, 1.5, 0.3, 1.4, 0.9, 7.9, 1.3, 0.8, 0.6, 1.2],
                       [1.3, 0.5, 0.5,   0, 1.4,   1,   1, 0.7, 1.5,   1,   8, 1.8, 1.2, 0.1, 0.7],
                       [1.6, 1.7, 1.3, 1.4,   0,   2, 2.2, 1.4, 0.1, 0.4, 6.6, 1.8, 1.6, 1.3, 1.8],
                       [2.1, 0.3, 1.3,   1,   2,   0, 0.1, 1.7, 2.3, 1.8, 7.8, 2.6, 2.3,   1, 0.6],
                       [2.3, 0.5, 1.5,   1, 2.2, 0.1,   0, 1.7, 2.3, 1.8, 7.8, 2.6, 2.3,   1, 0.6],
                       [0.7, 1.2, 0.3, 0.7, 1.4, 1.7, 1.7,   0, 1.5,   1, 7.9, 1.1, 0.5, 0.8, 1.5],
                       [1.7, 1.8, 1.4, 1.5, 0.1, 2.3, 2.3, 1.5,   0, 0.5, 6.8, 1.9, 1.7, 1.4, 2.1],
                       [1.2, 1.3, 0.9,   1, 0.4, 1.8, 1.8,   1, 0.5,   0, 6.9, 1.5, 1.2,   1, 1.6],
                       [7.4, 8.2, 7.9,   8, 6.6, 7.8, 7.8, 7.9, 6.8, 6.9,   0, 7.1, 7.1, 7.9, 8.5],
                       [0.6,   2, 1.3, 1.8, 1.8, 2.6, 2.6, 1.1, 1.9, 1.5, 7.1,   0, 0.4, 1.7, 2.7],
                       [  0, 1.7, 0.8, 1.2, 1.6, 2.3, 2.3, 0.5, 1.7, 1.2, 7.1, 0.4,   0, 1.3, 2.4],
                       [1.5, 0.4, 0.6, 0.1, 1.3,   1,   1, 0.8, 1.4,   1, 7.9, 1.7, 1.3,   0, 0.7],
                       [2.5, 0.7, 1.2, 0.7, 1.8, 0.6, 0.6, 1.5, 2.1, 1.6, 8.5, 2.7, 2.4, 0.7,   0]];
    const avgDist = 1.5;
    const UNKNOWN = -1;

    const startIndex = getDistanceIndex(start);
    const destIndex = getDistanceIndex(dest);

    if (startIndex === UNKNOWN || destIndex === UNKNOWN) {
        return avgDist;
    } else {
        return distances[startIndex][destIndex];
    }
}

function getDistanceIndex(location) {
    const locationCode = location.substring(0, 3);
    switch (locationCode) {
        case "UT-":
        case "ERC":
        case "TP-":
        case "UTS":
            return 0;
        case "AS1":
        case "AS2":
        case "AS3":
        case "AS4":
        case "AS5":
        case "AS6":
        case "AS7":
        case "AS8":
            return 1;
        case "E1-":
        case "E2-":
        case "E3-":
        case "E4-":
        case "E5-":
        case "ENG":
            return 2
        case "SDE":
            return 3;
        case "S1A":
        case "S2-":
        case "S4-":
        case "S5-":
        case "S6-":
        case "S7-":
        case "S8-":
        case "S11":
        case "S12":
        case "S13":
        case "S14":
        case "S16":
        case "S17":
            return 4;
        case "BIZ":
            return 5;
        case "I3-":
            return 6;
        case "YST":
            return 7;
        case "MD1":
            return 8;
        case "RVR":
            return 9;
        case "LKY":
            return 10;
        case "CAP":
        case "USP":
        case "TC-":
        case "RC4":
            return 11;
        case "Y-C":
        case "Y-G":
        case "Y-P":
        case "Y-K":
        case "Y-A":
        case "Y-T":
        case "Y-L":
            return 12;
        case "CEL":
            return 13;
        case "COM":
            return 14;
        default:
            return -1;
    }
}