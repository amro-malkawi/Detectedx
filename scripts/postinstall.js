const fs = require('fs-extra');

function changeReactHotKeysMap() {
    const filePath = './node_modules/react-hotkeys/es/vendor/react-dom/translateToKey.js';
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if(err) throw err;
        const newData = data.replace(/'32': ' ',/gim, '');
        fs.writeFile(filePath, newData, 'utf-8', function (err) {
            if (err) throw err;
            console.log('postinstall: es patch react-hots library');
        });
    });

    const filePath2 = './node_modules/react-hotkeys/es/react-hotkeys.production.min.js';
    fs.readFile(filePath2, 'utf-8', (err, data) => {
        if(err) throw err;
        const newData = data.replace(/32:" ",/gim, '');
        fs.writeFile(filePath2, newData, 'utf-8', function (err) {
            if (err) throw err;
            console.log('postinstall: cjs patch react-hots library');
        });
    });
}

changeReactHotKeysMap();
