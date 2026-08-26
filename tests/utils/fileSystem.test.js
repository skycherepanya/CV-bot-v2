const test = require('node:test');
const assert = require('node:assert');
const { readMasterProfile } = require('../../src/utils/fileSystem');

test('readMasterProfile should correctly parse the master_profile.yaml', () => {
    const profile = readMasterProfile();
    assert.ok(profile !== null && typeof profile === 'object', 'Profile should be an object');
    assert.ok('personal_info' in profile, 'Profile should contain personal_info');
    assert.ok('professional_summary' in profile, 'Profile should contain professional_summary');
    assert.ok('skills' in profile, 'Profile should contain skills');
    assert.ok('experience' in profile, 'Profile should contain experience');
});
