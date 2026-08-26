const { uploadFileToDrive } = require('./src/google/drive');
const { appendApplicationRow } = require('./src/google/sheets');

async function runTest() {
    try {
        console.log('1. Testing Google Drive Upload...');
        const dummyPdf = Buffer.from('%PDF-1.4\n% Dummy PDF Content for integration test\n%%EOF');
        const link = await uploadFileToDrive(dummyPdf, 'Test_Company_Applicant_CV.pdf');
        console.log('✅ Upload successful! Link:', link);

        console.log('\n2. Testing Google Sheets Append...');
        await appendApplicationRow('Test Company (Bot Test)', 'https://example.com/test-job', link);
        console.log('✅ Sheets append successful!');
        
    } catch (e) {
        console.error('❌ Test failed:', e);
    }
}
runTest();
