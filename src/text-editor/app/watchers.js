const fs = require('fs');

const fileWatchers = new Map();

exports.startWatchingFile = startWatchingFile;
exports.stopWatchingFile = stopWatchingFile;

function startWatchingFile(targetWindow,file) {
    stopWatchingFile(targetWindow);

    const watcher = fs.watch(file, sendNewContentToWindow);
    fileWatchers.set(targetWindow, watcher)

    function sendNewContentToWindow(event) {
        if( event === 'change') {
            const content = fs.readFileSync(file).toString();
            targetWindow.webContents.send('file-changed',file,content);
        }
    }
}

function stopWatchingFile(targetWindow) {
    if(fileWatchers.has(targetWindow)) {
        fileWatchers.get(targetWindow).close();
        fileWatchers.delete(targetWindow);
    }
}