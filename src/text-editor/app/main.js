const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

let mainWindow = null;

app.on('ready', function doTheMagic() {
    mainWindow = new BrowserWindow({ show: false });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.once('ready-to-show', function showWindow() {
        mainWindow.show();
    });

    mainWindow.on('closed', function removeWindow() {
        mainWindow = null;
    });
});

function getFileFromUserSelection(d, mWindow) {
    const files = d.showOpenDialog(mWindow, {
        properties: ['openFile'], // pick onley one file
        filters: [
            {name: 'Text files', extensions: ['txt','text']},
            {name: 'Markdown files', extensions: ['markdown','md']}
        ]
    });

    if(!files) return;

    return files[0];
}

exports.openFile = function openFile(filePath, d = dialog, mWindow = mainWindow) {
    const file = filePath || getFileFromUserSelection(d,mWindow);
    const content = fs.readFileSync(file).toString();
    mWindow.webContents.send('file-opened', file, content);
}