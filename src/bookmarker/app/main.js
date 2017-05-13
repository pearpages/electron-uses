const {app,BrowserWindow} = require('electron');

let mainWindow = null;

app.on('ready', function () {
    mainWindow = new BrowserWindow(
        {show:false}
    );
    mainWindow.once('ready-to-show', function showWindow() {
        mainWindow.show();
    });
    mainWindow.on('closed', function closeWindow() {
        mainWindow = null;
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`); // 800 x 600 by default

    require('devtron').install();

});