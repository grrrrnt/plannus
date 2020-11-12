exports.generate = (moduleData, year, semester) => {
    const moduleEvents = toEvents(moduleData, semester);
    const eventList = product(moduleEvents);
    return eventList.map(t => ({
        year: year,
        semester: semester,
        modules: moduleData.map(m => m.moduleCode),
        events: t
    }));
}

function product(moduleEvents) {
    let max = moduleEvents.map(m => m.choices.length).reduce((acc, cur) => acc * cur, 1);
    if (max > 100000) {
        max = 100000;
    }
    const eventsList = [];
    for (let i = 0; i < max; i++) {
        const events = [];
        let pos = i;
        for (const data of moduleEvents) {
            const choiceIdx = pos % data.choices.length;
            pos = (pos - choiceIdx) / data.choices.length;
            const choice = data.choices[choiceIdx];
            choice.lessons.forEach(lesson => events.push({
                moduleCode: data.moduleCode,
                lessonType: data.lessonType,
                classNo: choice.classNo,
                ...lesson
            }));
        }
        events.sort((a, b) => startMin(a) - startMin(b));
        if (!clashes(events)) {
            eventsList.push(events);
        }
    }
    return eventsList;
}

function toMinutes(timeStr) {
    return parseInt(timeStr.slice(0, 2)) * 60 + parseInt(timeStr.slice(2));
}

const dayOfWeek = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6 };

function toEvents(moduleData, semester) {
    moduleData.map(mod => mod.moduleCode).forEach(code => console.log(code));
    let events = [];
    for (const module of moduleData) {
        let types = {};
        for (const semesterData of module.semesterData) {
            if (semesterData.semester !== semester) continue;
            for (const lesson of semesterData.timetable) {
                if (!types.hasOwnProperty(lesson.lessonType)) {
                    types[lesson.lessonType] = {};
                }
                const lessonType = types[lesson.lessonType];
                if (!lessonType.hasOwnProperty(lesson.classNo)) {
                    lessonType[lesson.classNo] = [];
                }
                lessonType[lesson.classNo].push({
                    location: lesson.venue,
                    day: dayOfWeek[lesson.day],
                    startTime: toMinutes(lesson.startTime),
                    endTime: toMinutes(lesson.endTime),
                    weeks: lesson.weeks
                });
            }
        }
        for (const type in types) {
            const choices = Object.entries(types[type]).map(([classNo, v]) => ({ classNo: classNo, lessons: v }));
            events.push({ moduleCode: module.moduleCode, lessonType: type, choices: choices });
        }
    }
    return events;
}

function startMin(lesson) { return lesson.day * 1440 + lesson.startTime; }
function endMin(lesson) { return lesson.day * 1440 + lesson.endTime; }
function clashes(events) { return events.reduce((acc, cur) => startMin(cur) < acc ? 10080 : endMin(cur), 0) === 10080; }
