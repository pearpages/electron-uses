const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const {startWatchingFile, stopWatchingFile} = require('./watchers');

const windows = new Set(); // @learn

const filters = [
    { name: 'Text files', extensions: ['txt', 'text'] },
    { name: 'Markdown files', extensions: ['markdown', 'md'] }
];

exports.createWindow = createWindow;
exports.openFile = openFile;
exports.saveMarkdown = saveMarkdown;

app.on('ready', function doTheMagic() {
    require('./menu');
    createWindow(windows);
});

app.on('will-finish-launching', () => {
    app.on('open-file', (event, filePath) => { createWindow(windows, dialog, filePath) })
});

function createWindow(w = windows, aDialog, file) {
    aDialog = aDialog || dialog;
    const newWindow = new BrowserWindow({ show: false });
    w.add(newWindow);

    newWindow.loadURL(`file://${__dirname}/index.html`);

    newWindow.once('ready-to-show', function showWindow() {
        if (file) openFile(newWindow, file);
        newWindow.show();
    });

    newWindow.on('close', handleWhenClosing(newWindow, aDialog));

    newWindow.on('closed', function removeWindow() {
        w.delete(newWindow);
        stopWatchingFile(newWindow);
    });
}

function saveMarkdown(targetWindow, file, content, dial = dialog) {

    if (!file) {
        file = dial.showSaveDialog(targetWindow, {
            title: 'Save Markdown',
            defaultPath: app.getPath('documents'),
            filters: filters
        })
    }

    if(!file) return;

    fs.writeFileSync(file,content);
    targetWindow.webContents.send('file-opened',file,content);
}

function handleWhenClosing(window, cDialog) {
    return function closing(event) {
        if (window.isDocumentEdited()) {
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

            if (result === 0) {
                window.destroy();
            }
        }
    }
}

function getFileFromUserSelection(d, mWindow) {
    const files = d.showOpenDialog(mWindow, {
        properties: ['openFile'], // pick onley one file
        filters: filters
    });

    if (!files) return;

    return files[0];
}

function openFile(targetWindow, filePath, d = dialog) {
    const file = filePath || getFileFromUserSelection(d, targetWindow);
    const content = fs.readFileSync(file).toString();

    app.addRecentDocument(file); // @learn
    startWatchingFile(targetWindow,file);

    targetWindow.webContents.send('file-opened', file, content);
    targetWindow.setTitle(`${file}`); // window title
    targetWindow.setRepresentedFilename(file); // @learn : right click button extra functionality
}