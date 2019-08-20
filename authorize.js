const fs = require('fs');
const { google } = require('googleapis');

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Exporting the authorize function so I can use it in other scripts
module.exports = {
  /**
  * Create an OAuth2 client with the given credentials.
  * @param {Object} credentials The authorization client credentials.
  */
  authorize: (credentials, callback, res) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
      oAuth2Client.setCredentials(JSON.parse(token))
      callback(oAuth2Client, res);      
    });
  }
}
