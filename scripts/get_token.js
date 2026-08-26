const { google } = require('googleapis');
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync('client_secret.json'));
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const code = '4/0ATsMZqBc97-1C3flVMFRukC43JtTLR3HC2OfTHGUA6qd9tL-MU9Cffb-6GqmHBdq-wlYew';

async function getToken() {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    fs.writeFileSync('token.json', JSON.stringify(tokens));
    console.log('Token successfully generated and saved to token.json');
  } catch (error) {
    console.error('Error retrieving access token', error);
  }
}

getToken();
