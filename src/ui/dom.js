function createElement(tag, className = '', text = '') {
    const el = document.createElement(tag);
    if(className) el.className = className;
    if(text) el.textContent = text;
    return el;
};

function clearElement(el) {
    el.innerHTML = '';
}

function qs(selector) {
    return document.querySelector(selector);
}

export { createElement, clearElement, qs }