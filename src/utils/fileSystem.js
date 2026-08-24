const fs = require('fs');
const path = require('path');

function readMasterProfile() {
    const profilePath = path.join(process.cwd(), 'master_profile.md');
    if (!fs.existsSync(profilePath)) {
        throw new Error('master_profile.md not found');
    }
    return fs.readFileSync(profilePath, 'utf8');
}

module.exports = { readMasterProfile };
