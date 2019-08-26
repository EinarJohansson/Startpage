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
                            serverRes.sendStatus(404)
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
                if (cal.summary == "Uppgifter") {
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
                            serverRes.sendStatus(404)
                        }
                    });
                }
            });
        });
    }
}