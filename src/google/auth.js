const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const CREDENTIALS_PATH = path.join(process.cwd(), 'client_secret.json');
const TOKEN_PATH = path.join(process.cwd(), 'token.json');

function getAuthClient() {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    oAuth2Client.setCredentials(token);

    // Update token.json if access_token is refreshed
    oAuth2Client.on('tokens', (tokens) => {
        if (tokens.refresh_token) {
            token.refresh_token = tokens.refresh_token;
        }
        token.access_token = tokens.access_token;
        token.expiry_date = tokens.expiry_date;
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('Token refreshed and saved.');
    });

    return oAuth2Client;
}

module.exports = { getAuthClient };
