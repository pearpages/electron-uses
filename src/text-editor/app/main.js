const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

const windows = new Set();

exports.createWindow = createWindow;
exports.openFile = openFile;

app.on('ready', function doTheMagic() {
    createWindow(windows);
});

function createWindow(w = windows) {
    const newWindow = new BrowserWindow({ show: false });
    w.add(newWindow);

    newWindow.loadURL(`file://${__dirname}/index.html`);

    newWindow.once('ready-to-show', function showWindow() {
        newWindow.show();
    });

    newWindow.on('closed', function removeWindow() {
        w.delete(newWindow);
    });
}

function getFileFromUserSelection(d, mWindow) {
    const files = d.showOpenDialog(mWindow, {
        properties: ['openFile'], // pick onley one file
        filters: [
            { name: 'Text files', extensions: ['txt', 'text'] },
            { name: 'Markdown files', extensions: ['markdown', 'md'] }
        ]
    });

    if (!files) return;

    return files[0];
}

function openFile(targetWindow, filePath, d = dialog) {
    const file = filePath || getFileFromUserSelection(d, targetWindow);
    const content = fs.readFileSync(file).toString();
    targetWindow.webContents.send('file-opened', file, content);
    targetWindow.setTitle(`${file}`); // window title
    targetWindow.setRepresentedFilename(file); // right click button extra functionality
}