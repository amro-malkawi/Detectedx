const fs = require('fs-extra');

function copyPublicFolder() {
    fs.copySync('./public/manifest.json', './dist/manifest.json', {
        dereference: true,
        filter: file => file !== './public/index.html',
    });
}

copyPublicFolder();