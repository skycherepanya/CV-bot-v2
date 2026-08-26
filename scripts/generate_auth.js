const { google } = require('googleapis');
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync('client_secret.json'));
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets'
];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'
});

console.log('----------------------------------------------------');
console.log('AUTHORIZE_URL:', authUrl);
console.log('----------------------------------------------------');
