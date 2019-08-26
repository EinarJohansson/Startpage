const { google } = require('googleapis');

module.exports = {
    /**
    * Get the next 10 events on the test calendar.
    * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
    */
    getTests: (auth, serverRes) => {
        const calendar = google.calendar({ version: 'v3', auth });
        // Fetching all of the user's calendars
        calendar.calendarList.list((err, res) => {
            // Här får jag inget tillbaks: Error: No access, refresh token or API key is set.
            if (err) console.log(err);
            const calendars = res.data.items;
            calendars.forEach(cal => {
                // Looking for the calendar with information about my tests
                if (cal.summary == "Prov") {
                    // List the 10 next events in that calendar
                    calendar.events.list({
                        calendarId: cal.id,
                        timeMin: (new Date()).toISOString(),
                        maxResults: 10,
                        singleEvents: true,
                        orderBy: 'startTime',
                    }, (err, res) => {
                        if (err) return console.log('The API returned an error: ' + err);
                        const events = res.data.items;
                        if (events.length) {
                            serverRes.send(events);
                        } else {
                            serverRes.sendStatus(404);
                        }
                    });
                }
            });
        });
    },
    /**
    * Get the next 10 events on the assignments calendar.
    * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
    */
    getAssignments: (auth, serverRes) => {
        const calendar = google.calendar({ version: 'v3', auth });
        // Fetching all of the user's calendars
        calendar.calendarList.list((err, res) => {
            const calendars = res.data.items;
            calendars.forEach(cal => {
                // Looking for the calendar with information about my assignments
                if (cal.summary == "Uppgift") {
                    // List the 10 next events in that calendar
                    calendar.events.list({
                        calendarId: cal.id,
                        timeMin: (new Date()).toISOString(),
                        maxResults: 10,
                        singleEvents: true,
                        orderBy: 'startTime',
                    }, (err, res) => {
                        if (err) return console.log('The API returned an error: ' + err);
                        const events = res.data.items;
                        if (events.length) {
                            serverRes.send(events)
                        } else {
                            serverRes.sendStatus(404);
                        }
                    });
                }
            });
        });
    },
    getCourseWork: (auth, serverRes) => {
        const classroom = google.classroom({ version: 'v1', auth });
        var response = {};

        classroom.courses.list({
            // Only list active courses
            courseStates: "ACTIVE"
        }, (err, res) => {
            if (err) return console.error('The API returned an error: ' + err);
            const courses = res.data.courses;
            if (courses && courses.length) {
                for (let i = 0; i < courses.length; i++) {
                    // Gör ett object för varje kurs och stoppa in alla uppgifter där
                    response[courses[i].name] = {};
                    classroom.courses.courseWork.list({
                        courseId: courses[i].id,
                        orderBy: "dueDate desc"
                    }, (err, res) => {
                        if (err) return console.log('The API returned an error: ' + err);
                        var courseWork = res.data.courseWork;
    
                        if (courseWork) {
                            for (let j = 0; j < courseWork.length; j++) {
                                response[courses[i].name][courseWork[j].title] = {};

                                if (courseWork[j].dueDate && courseWork[j].dueTime) {
                                    var year = courseWork[j].dueDate.year;
                                    var month = courseWork[j].dueDate.month;
                                    var day = courseWork[j].dueDate.day;

                                    var hours = courseWork[j].dueTime.hours;
                                    var minutes = courseWork[j].dueTime.minutes;

                                    var date = new Date(year + '/' + month + '/' + day + ',' + hours + ':' + minutes);

                                    response[courses[i].name][courseWork[j].title].date = date;
                                }
                                else if (courseWork[j].dueDate) {
                                    var year = courseWork[j].dueDate.year;
                                    var month = courseWork[j].dueDate.month;
                                    var day = courseWork[j].dueDate.day;

                                    var date = new Date(year + '/' + month + '/' + day);

                                    response[courses[i].name][courseWork[j].title].date = date;
                                }

                                // Send it if we have all the objects finnished
                                if (i == courses.length - 1 && j == courseWork.length - 1) {
                                    delete response["Mentor te18a"];
                                    serverRes.send(response);
                                }
                            }
                        } else {
                            // Remove that course from the response object
                            delete response[courses[i].name]
                        }
                    });
                }
            } else {
                console.log('No courses found.');
            }
        });
    }
}