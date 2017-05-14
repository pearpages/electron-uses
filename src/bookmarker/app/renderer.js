const { shell,remote } = require('electron');
const systemPreferences = remote.systemPreferences; // not used in the code, example of how to access system preferences
const parser = new DOMParser();

const newLinkUrl = handleNewLinksUrl();
const linksSection = getLinksSection(shell);
handleForm(newLinkUrl, linksSection, parser);

function handleForm(newLinkUrl, linksSection, parser) {
    const form = document.querySelector('.new-link-form');
    form.addEventListener('submit', handleSubmit);

    function addToPage({ title, url }) {
        const newLink = getNewLinkTemplate();
        const titleElement = newLink.querySelector('.link--title');
        const urlElement = newLink.querySelector('.link--url');

        titleElement.textContent = title;
        urlElement.href = url;
        urlElement.textContent = url;

        linksSection.appendChild(newLink);

        return { title, url };
    }

    function getNewLinkTemplate() {
        const linkTemplate = document.querySelector('#link-template');
        const newLink = linkTemplate.content.cloneNode(true); // deep clone
        return newLink;
    }

    function handleSubmit(event) {
        event.preventDefault();

        const url = newLinkUrl.value;
        fetch(url)
            .then(function getResponse(response) {
                return response.text();
            })
            .then(function parseResponse(text) {
                return parser.parseFromString(text, 'text/html');
            })
            .then(function findTitle(nodes) {
                return nodes.querySelector('title').textContent;
            })
            .then(title => ({ title, url }))
            .then(addToPage)
            .catch(function showError(error) {
                console.error(error);
            })
    }
}

function getLinksSection(shell) {
    const linksSection = document.querySelector('.links');
    linksSection.addEventListener('click', handleClick);
    return linksSection;

    function handleClick(event) {
        if (event.target.href) {
            event.preventDefault();
            const target = event.target.href;
            if (target) {
                shell.openExternal(target);
            }
        }
    }
}

function handleNewLinksUrl() {
    const newLinkUrl = document.querySelector('#new-link-url'); // Returns the first Element within the document that matches the specified selector, or group of selectors.
    newLinkUrl.value = 'https://pearpages.com';

    const newLinkSubmit = document.querySelector('.new-link-form--submit');
    newLinkSubmit.disabled = false;

    newLinkUrl.addEventListener('keyup', function whetherActivate() {
        newLinkSubmit.disabled = !newLinkUrl.validity.valid;
    });
    return newLinkUrl;
}