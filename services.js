const { google } = require('googleapis');

module.exports = {
    /**
     * Lists the first 10 courses the user has access to.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    getCourses: (auth) => {
        const classroom = google.classroom({ version: 'v1', auth });
        classroom.courses.list({
            pageSize: 10,
        }, (err, res) => {
            if (err) return console.error('The API returned an error: ' + err);
            const courses = res.data.courses;
            if (courses && courses.length) {
                console.log('Courses:');
                console.log(courses);
            } else {
                console.log('No courses found.');
            }
        });
    },
    /**
    * Lists the next 10 events on the user's primary calendar.
    * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
    */
    getTests: (auth) => {
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
                            console.log('Upcoming 10 tests:');
                            console.log(events);
                        } else {
                            console.log('No upcoming tests found.');
                        }
                    });
                }
            });
        });
    },
    getAssignments: (auth) => {
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
                            console.log('Upcoming 10 assignments:');
                            console.log(events);
                        } else {
                            console.log('No upcoming assignments found.');
                        }
                    });
                }
            });
        });
    }
}