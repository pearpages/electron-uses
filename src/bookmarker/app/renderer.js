const newLinkUrl = document.querySelector('#new-link-url'); // Returns the first Element within the document that matches the specified selector, or group of selectors.
newLinkUrl.value = 'https://pearpages.com';
const newLinkSubmit = document.querySelector('.new-link-form--submit');
newLinkSubmit.disabled = false;
const form = document.querySelector('.new-link-form');
const linkTemplate = document.querySelector('#link-template');
const linksSection = document.querySelector('.links');

newLinkUrl.addEventListener('keyup', function whetherActivate() {
    newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

const parser = new DOMParser();
function parseResponse(text) {
    return parser.parseFromString(text,'text/html');
}
function findTitle(nodes) {
    return nodes.querySelector('title').textContent;
}

function addToPage({title,url}) {
    const newLink = linkTemplate.content.cloneNode(true); // deep clone
    const titleElement = newLink.querySelector('.link--title');
    const urlElement = newLink.querySelector('.link--url');

    titleElement.textContent = title;
    urlElement.href = url;
    urlElement.textContent = url;

    linksSection.appendChild(newLink);
    return {title, url};
}

form.addEventListener('submit', function submit(event) {
    event.preventDefault();

    const url = newLinkUrl.value;
    fetch(url)
        .then(function getResponse(response) {
            return response.text();
        })
        .then(parseResponse)
        .then(findTitle)
        .then(title => ({title, url}))
        .then(addToPage)
        .then(title => console.log(title))
        .catch(function showError(error) {
            console.error(error);
        })
});