const { google } = require('googleapis');
const { getAuthClient } = require('./auth');

const SPREADSHEET_ID = '19bWeJ6shG84NWnp8E9sS0ODHRGh7doiDJ2qumODr1-8';

async function appendApplicationRow(company, vacancyLink, coverLetterLink) {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Format date as DD.MM.YYYY
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    const dateStr = `${dd}.${mm}.${yyyy}`;

    const values = [
        [
            "", // Column A: № з/п (skip or leave empty)
            company, // Column B: Компанія
            vacancyLink || company, // Column C: Посилання на вакансію або компанія
            dateStr, // Column D: Дата
            coverLetterLink, // Column E: Супровідний лист
            // Add empty strings for remaining columns to avoid breaking formatting if needed, but not strictly required by append
        ]
    ];

    const resource = {
        values,
    };

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'B:E', // Start appending around these columns. Google Sheets is smart enough to append at the bottom of the table.
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: resource,
        });
        console.log('Row appended successfully.');
    } catch (err) {
        console.error('Error appending to Google Sheets:', err);
        throw err;
    }
}

module.exports = { appendApplicationRow };
