const test = require('node:test');
const assert = require('node:assert');
const { readMasterProfile } = require('../../src/utils/fileSystem');
const fs = require('fs');

test('readMasterProfile should read the markdown file', () => {
    fs.writeFileSync('./master_profile.md', '# Dummy Profile');
    const content = readMasterProfile();
    assert.strictEqual(content, '# Dummy Profile');
});
