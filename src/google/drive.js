const { google } = require('googleapis');
const { getAuthClient } = require('./auth');
const stream = require('stream');

const FOLDER_ID = '1hR8JjuJmSMkYr5eu5aK4iOWERAt3gc77'; // Hardcoded for simplicity based on user input

async function uploadFileToDrive(buffer, filename) {
    const auth = getAuthClient();
    const drive = google.drive({ version: 'v3', auth });

    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    const fileMetadata = {
        name: filename,
        parents: [FOLDER_ID]
    };
    
    const media = {
        mimeType: 'application/pdf',
        body: bufferStream
    };

    try {
        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink'
        });
        
        return file.data.webViewLink;
    } catch (err) {
        console.error('Error uploading file to Google Drive:', err);
        throw err;
    }
}

module.exports = { uploadFileToDrive };
