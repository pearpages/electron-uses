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

function getFileFromUserSelection(dialog) {
    const files = dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'], // pick onley one file
        filters: [
            {name: 'Text files', extensions: ['txt','text']},
            {name: 'Markdown files', extensions: ['markdown','md']}
        ]
    });

    if(!files) return;

    const file = files[0];
    const content = fs.readFileSync(file).toString();
}