const marked = require('marked'); // turns markdown to html
const { remote, ipcRenderer } = require('electron'); // ipcRenderer: connect to main.js
const { openFile, createWindow } = remote.require('./main');
const currentWindow = remote.getCurrentWindow();

let filePath = null;
let originalContent = '';

init();

function init() {
    const htmlView = document.querySelector("#html");
    const renderer = renderMarkdownToHtml(marked, htmlView,currentWindow);
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
        filePath = file;
        originalContent = content;
        renderer(event,file,content);
    }
}

function renderMarkdownToHtml(marked, htmlContainer,win) {
    return (event,file,content) => {
        const value = (event.target) ? event.target.value : content;
        htmlContainer.innerHTML = marked(value, { sanitize: true })
        win.setDocumentEdited(value !== originalContent);
    };
}

function getMarkdownView(htmlView,renderer,id,win) {
    const markdownView = document.querySelector(id);
    markdownView.addEventListener('keyup', renderer);
    return markdownView;
}

function getOpenFileButton(window) {
    const openFileButton = document.querySelector("#open-file");
    openFileButton.addEventListener('click', doOpenFile);

    function doOpenFile() {
        openFile(window);
    }
}