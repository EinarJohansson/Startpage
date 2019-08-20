const { google } = require('googleapis');

module.exports = {
    /**
     * Lists the first 10 courses the user has access to.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    getCourses: (auth, serverRes) => {
        const classroom = google.classroom({ version: 'v1', auth });
        classroom.courses.list((err, res) => {
            if (err) return console.error('The API returned an error: ' + err);
            const courses = res.data.courses;
            if (courses && courses.length) {
                serverRes.send(courses);
            } else {
                console.log('No courses found.');
            }
        });
    },
    /**
    * Lists the next 10 events on the user's primary calendar.
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
                            serverRes.send(events)
                        } else {
                            console.log('No upcoming tests found.');
                        }
                    });
                }
            });
        });
    },
    getAssignments: (auth, serverRes) => {
        const calendar = google.calendar({ version: 'v3', auth });
        // Fetching all of the user's calendars
        calendar.calendarList.list((err, res) => {
            const calendars = res.data.items;
            calendars.forEach(cal => {
                // Looking for the calendar with information about my assignments
                if (cal.summary == "Läxor") {
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
                            console.log('No upcoming assignments found.');
                        }
                    });
                }
            });
        });
    }
}