const marked = require('marked'); // turns markdown to html
const { remote, ipcRenderer } = require('electron'); // ipcRenderer: connect to main.js
const { openFile, createWindow } = remote.require('./main');
const currentWindow = remote.getCurrentWindow();

init();

function init() {
    const htmlView = document.querySelector("#html");
    const renderer = renderMarkdownToHtml(marked, htmlView);
    const markdownView = getMarkdownView(htmlView,renderer,"#markdown",currentWindow);
    const newFileButton = getNewFileButton('#new-file',createWindow);
    const openFileButton = getOpenFileButton(currentWindow);
    const saveMarkdownButton = document.querySelector("#save-markdown");
    const revertButton = document.querySelector("#revert");
    const saveHtmlButton = document.querySelector("#save-html");

    ipcRenderer.on('file-opened', handleFileOpened(markdownView,renderer));
}

function getNewFileButton(id,newWindowHandler) {
    const newFileButton  = document.querySelector(id);
    newFileButton.addEventListener('click',makeWindow);
    return newFileButton;

    function makeWindow() {
        newWindowHandler();
    }
}

function handleFileOpened(markdownView,renderer) {
    return function fileOpenedHandler(event,file,content) {
        markdownView.value = content;
        renderer(event,file,content);
    }
}

function renderMarkdownToHtml(marked, htmlContainer) {
    return (event,file,content) => {
        const value = (event.target) ? event.target.value : content;
        htmlContainer.innerHTML = marked(value, { sanitize: true })
    };
}

function getMarkdownView(htmlView,renderer,id,win) {
    const markdownView = document.querySelector(id);
    markdownView.addEventListener('keyup', renderer);
    win.setDocumentEdited(true);
    return markdownView;
}

function getOpenFileButton(window) {
    const openFileButton = document.querySelector("#open-file");
    debugger;
    openFileButton.addEventListener('click', doOpenFile);

    function doOpenFile() {
        openFile(window);
    }
}