const marked = require('marked'); // turns markdown to html
const { remote, ipcRenderer } = require('electron'); // ipcRenderer: connect to main.js
const { openFile } = remote.require('./main');
const currentWindow = remote.getCurrentWindow();

init();

function init() {
    const htmlView = document.querySelector("#html");
    const renderer = renderMarkdownToHtml(marked, htmlView);
    const markdownView = getMarkdownView(htmlView,renderer,"#markdown");
    const newFileButton = document.querySelector("#new-file");
    const openFileButton = getOpenFileButton(currentWindow);
    const saveMarkdownButton = document.querySelector("#save-markdown");
    const revertButton = document.querySelector("#revert");
    const saveHtmlButton = document.querySelector("#save-html");


    ipcRenderer.on('file-opened', handleFileOpened(markdownView,renderer));
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

function getMarkdownView(htmlView,renderer,id) {
    const markdownView = document.querySelector(id);
    markdownView.addEventListener('keyup', renderer);
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