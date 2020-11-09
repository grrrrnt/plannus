exports.scoring = (priorities, timetable) => {
    var score = 0;
    for (priority in priorities) {
        score += getScore(priorities.length, priority, timetable);
    }
    return score;
}

function getScore(count, priority, timetable) {
    var multiplier = 0;
    var rank = priority.rank;
    switch(priority.type) {
        case "AvoidAfterPriority":
            var time = priority.fields.time;
            multiplier = avoidLessonsAfterPriorityMultiplier(rank, time, timetable);
            break;
        case "AvoidBeforePriority":
            var time = priority.fields.time;
            multiplier = avoidLessonsBeforePriorityMultiplier(rank, time, timetable);
            break;
        case "FreePeriodPriority":
            var fromTime = priority.fields.fromTime;
            var toTime = priority.fields.toTime;
            multiplier = freePeriodPriorityMultiplier(rank, fromTime, toTime, timetable);
            break;
        case "LunchBreakPriority":
            var hours = priority.fields.hours;
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
    return getScore(count, rank, multiplier);
}

function getScore(count, rank, multiplier) {
    var max = count + 1 - rank;
    var score = multiplier * max;
    return score;
}

function avoidLessonsAfterPriorityMultiplier(rank, time, timetable) {
    var multiplier = 1;
    for (var day = 0; day <= 4; day++) {
        for (var e = 0; e < timetable.length; e++) {
            if (timetable[e].endTime > time && timetable[e].day == day) {
                multiplier = multiplier - 0.2;
                break;
            }
        }
    }
    return multiplier;
}

function avoidLessonsBeforePriorityMultiplier(rank, time, timetable) {
    var multiplier = 1;
    for (var day = 0; day <= 4; day++) {
        for (var e = 0; e < timetable.length; e++) {
            if (timetable[e].startTime < time && timetable[e].day == day) {
                multiplier = multiplier - 0.2;
                break;
            }
        }
    }
    return multiplier;
}

function freePeriodPriorityMultiplier(rank, fromTime, toTime, timetable) {
    var multiplier = 1;
    for (int day = 0; day <= 4; day++) {
        for (var e = 0; e < timetable.length; e++) {
            if (timetable[e].day == day && timetable[e].startTime < toTime && timetable[e].endTime > fromTime) {
                multiplier = multiplier - 0.2;
                break;
            }
        }
    }
    return multiplier;
}

function lunchBreakPriorityMultiplier(rank, hours, timetable) {
    var multiplier = 1;
    var isFree = false;
    for (int day = 0; day <= 4; day++) {
        for (int from = 10; from + hours <= 15; from++) {
            if (isFree) { break; } else {
                for (var e = 0; e < timetable.length; e++) {
                    if (timetable[e].day != day) { continue; }
                    if (timetable[e].startHour < from + hours && timetable[e].endHour > from) { break; }
                    isFree = true;
                }
            }
        }
        if (!isFree) { multiplier = multiplier - 0.2; }
    }
    return multiplier;
}

function maxFreeDaysPriorityMultiplier(rank, timetable) {
    var multiplier = 1;
    return multiplier;
}

function minBreaksPriorityMultiplier(rank, timetable) {
    var multiplier = 1;
    return multiplier;
}

function minTravellingPriorityMultiplier(rank, timetable) {
    var multiplier = 1;
    return multiplier;
}