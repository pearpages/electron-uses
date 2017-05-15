const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

const windows = new Set();

exports.createWindow = createWindow;
exports.openFile = openFile;

app.on('ready', function doTheMagic() {
    createWindow(windows);
});

function createWindow(w = windows,aDialog = dialog) {
    const newWindow = new BrowserWindow({ show: false });
    w.add(newWindow);

    newWindow.loadURL(`file://${__dirname}/index.html`);

    newWindow.once('ready-to-show', function showWindow() {
        newWindow.show();
    });

    newWindow.on('close',handleWhenClosing(newWindow,aDialog));

    newWindow.on('closed', function removeWindow() {
        w.delete(newWindow);
    });
}

function handleWhenClosing(window, cDialog) {
    return function closing (event) {
        if(window.isDocumentEdited()) {
            event.preventDefault();
            const result = cDialog.showMessageBox(window, {
                type: 'warning',
                title: 'Quit with Unsaved Changes?',
                message: 'Your changes will be lost if you do not save first.',
                buttons: [
                    'Quit Anyway',
                    'Cancel'
                ],
                defaultId: 0,
                cancelId: 1
            });

            if(result === 0) {
                window.destroy();
            }
        }
    }
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