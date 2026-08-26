const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function readMasterProfile() {
    const profilePath = path.join(process.cwd(), 'master_profile.yaml');
    if (!fs.existsSync(profilePath)) {
        throw new Error('master_profile.yaml not found');
    }
    const fileContents = fs.readFileSync(profilePath, 'utf8');
    return yaml.load(fileContents);
}

module.exports = { readMasterProfile };
