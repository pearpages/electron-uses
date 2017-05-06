# Electron Uses

Inherently offline first.

## Good Use Cases

+ You want to build an application that has advanced permissions like accessing the file system.
+ You want to build a small application that lives in the user's menubar or system tray.
+ A an app that works well offline.
+ You want to build a GUI for your Node Application.

## Benefits

+ Chrome Content Module (HTML, GPU, V8)
+ Filesystem access, Native modules

---

## Install Electron Globally

```bash
sudo npm i -g electron
```

---

## Basic Usage

```bash
npm init
```

```json
/* package.json */
{
    "main": "index.js"
}
```

### Modules

```js
const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;
const globalShortcut = electron.globalShortcut;
const ipcMain = electron.ipcMain;
```

### Ready Event

```js
const electron = require('electron');

const app = electron.app;

app.on('ready');
```

### Events

+ ready
+ will-quit
+ will-finish-launching
+ window-all-closed
+ before-quit
+ quit
+ open-file
+ open-url
+ activate
+ browser-window-blur
+ browser-window-focus
+ browser-window-created
+ ...





