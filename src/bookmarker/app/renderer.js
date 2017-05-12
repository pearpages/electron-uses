const parser = new DOMParser();

const newLinkUrl = handleNewLinksUrl();
handleForm(newLinkUrl, parser);

function handleForm(newLinkUrl, parser) {
    const form = document.querySelector('.new-link-form');
    form.addEventListener('submit', handleSubmit);

    function addToPage({ title, url }) {
        const newLink = getNewLinkTemplate();
        const titleElement = newLink.querySelector('.link--title');
        const urlElement = newLink.querySelector('.link--url');

        titleElement.textContent = title;
        urlElement.href = url;
        urlElement.textContent = url;

        const linksSection = document.querySelector('.links');
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
            .then(title => console.log(title))
            .catch(function showError(error) {
                console.error(error);
            })
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