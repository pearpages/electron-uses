const marked = require('marked'); // @learn : turns markdown to html
const { remote, ipcRenderer, shell } = require('electron'); // @learn : ipcRenderer: connect to main.js
const { openFile, createWindow, saveMarkdown } = remote.require('./main');
const currentWindow = remote.getCurrentWindow();

let filePath = null;
let originalContent = '';

const htmlView = document.querySelector("#html");
const renderer = renderMarkdownToHtml(marked, htmlView, currentWindow);
const markdownView = getMarkdownView(htmlView, renderer, "#markdown", currentWindow);
const newFileButton = getNewFileButton('#new-file', createWindow);
const openFileButton = getOpenFileButton(currentWindow,"#open-file");
const saveMarkdownButton = getSaveButton('#save-markdown');
const revertButton = getRevertButton('#revert',renderer);
const saveHtmlButton = document.querySelector("#save-html");
const showFileButton = getShowFileButton("#show-file");
const openInDefaultButton = getOpenInDefaultButton("#open-in-default");

ipcRenderer.on('file-opened', handleFileOpened(markdownView, renderer));
ipcRenderer.on('file-changed', handleFileOpened(markdownView, renderer));

function getShowFileButton (id) {
    const showFileButton = document.querySelector(id);
    showFileButton.addEventListener('click',handleClick);
    return showFileButton;

    function handleClick(event) {
        shell.showItemInFolder(filePath);
    }
}

function getOpenInDefaultButton (id) {
    const openInDefaultButton = document.querySelector(id);
    openInDefaultButton.addEventListener('click',handleClick);
    return openInDefaultButton;

    function handleClick(event) {
        shell.openItem(filePath);
    }
}

function getRevertButton(id,renderer) {
    const revertButton = document.querySelector(id);
    revertButton.addEventListener('click',revert);

    function revert(event) {
        markdownView.value = originalContent;
        renderer('whatever',filePath,originalContent);
    }
    return revertButton;
}

function getSaveButton(id) {
    const saveButton = document.querySelector(id);
    saveButton.addEventListener('click', handleClick);
    return saveButton;

    function handleClick(event) {
        saveMarkdown(currentWindow,filePath,markdownView.value);
    }
}


function getNewFileButton(id, newWindowHandler) {
    const newFileButton = document.querySelector(id);
    newFileButton.addEventListener('click', makeWindow);
    return newFileButton;

    function makeWindow() {
        newWindowHandler();
    }
}

function updateEditedState(isEdited) {
    currentWindow.setDocumentEdited(isEdited);
    saveMarkdownButton.disabled = !isEdited;
    revertButton.disabled = !isEdited;

    let title = 'file';
    if (filePath) title = `${filePath} - ${title}`;
    if (isEdited) title += ' (Edited)';
    currentWindow.setTitle(title);
}

function handleFileOpened(markdownView, renderer) {
    return function fileOpenedHandler(event, file, content) {
        markdownView.value = content;
        setFilePath(file);
        originalContent = content;
        renderer(event, file, content);
    }
}

function setFilePath(file) {
    filePath = file;
    showFileButton.disabled = (file) ? false : true;
}

function renderMarkdownToHtml(marked, htmlContainer, win) {
    return (event, file, content) => {
        const value = (event.target) ? event.target.value : content;
        htmlContainer.innerHTML = marked(value, { sanitize: true })
        updateEditedState(value !== originalContent);
    };
}

function getMarkdownView(htmlView, renderer, id, win) {
    const markdownView = document.querySelector(id);
    markdownView.addEventListener('keyup', renderer);
    return markdownView;
}

function getOpenFileButton(window,id) {
    const openFileButton = document.querySelector(id);
    openFileButton.addEventListener('click', doOpenFile);

    function doOpenFile() {
        openFile(window);
    }
}