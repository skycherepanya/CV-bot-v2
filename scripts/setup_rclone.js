const fs = require('fs');
const path = require('path');

const credentials = JSON.parse(fs.readFileSync('client_secret.json'));
const token = JSON.parse(fs.readFileSync('token.json'));

const { client_secret, client_id } = credentials.installed;

// Convert expiry_date (ms) to ISO string for rclone
const expiryIso = new Date(token.expiry_date).toISOString();

const rcloneToken = {
  access_token: token.access_token,
  token_type: "Bearer",
  refresh_token: token.refresh_token,
  expiry: expiryIso
};

const rcloneConfDir = path.join(process.env.HOME, '.config', 'rclone');
if (!fs.existsSync(rcloneConfDir)) {
  fs.mkdirSync(rcloneConfDir, { recursive: true });
}

const rcloneConfPath = path.join(rcloneConfDir, 'rclone.conf');
const confContent = `[gdrive]
type = drive
client_id = ${client_id}
client_secret = ${client_secret}
scope = drive.file
token = ${JSON.stringify(rcloneToken)}
`;

fs.writeFileSync(rcloneConfPath, confContent);
console.log('rclone.conf successfully generated.');
