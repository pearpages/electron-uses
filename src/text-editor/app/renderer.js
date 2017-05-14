const marked = require('marked'); // turns markdown to html

const htmlView = document.querySelector("#html");
const markdownView = getMarkdownView(htmlView);
const newFileButton = document.querySelector("#new-file");
const openFileButton = document.querySelector("#open-file");
const saveMarkdownButton = document.querySelector("#save-markdown");
const revertButton = document.querySelector("#revert");
const saveHtmlButton = document.querySelector("#save-html");

function renderMarkdownToHtml(marked,htmlContainer) {
    return (event) => {htmlContainer.innerHTML = marked(event.target.value, {sanitize: true}) };
}

function getMarkdownView(htmlView) {
    const markdownView = document.querySelector("#markdown");
    markdownView.addEventListener('keyup',renderMarkdownToHtml(marked,htmlView));
    return markdownView;
}