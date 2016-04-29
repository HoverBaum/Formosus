const localStorage = window.localStorage;
var config = {
    language: 'english'
}

function init() {
    transformDOMEvents();
    registerListeners();

    loadData();
    enableOptions();
}

/**
 *   Load users name and config data.
 */
function loadData() {

    //Users name.
    let name = 'Friend';
    let localName = localStorage.getItem('name');
    if(localName) {
        name = localName;
    }
    emit('name-changed', name);

    //Users config.
    let localConfig = JSON.parse(localStorage.getItem('config'));
    if(localConfig !== undefined) {
        config = localConfig;
    }
    emit('config-changed', config);
}

/**
 *   Registers listeners for DOM events and emits new events..
 */
function transformDOMEvents() {

    //Name changes.
    let nameInput = document.querySelector('#name-input');
    nameInput.addEventListener('keyup', function() {
        emit('name-changed', nameInput.value);
    });

    //Langauge changes.
    let langInput = document.querySelector('#lang-select');
    langInput.addEventListener('change', function() {
        config.language = langInput.value;
        emit('config-changed', config);
    });
}

/**
 *   Register listeners for important events.
 */
function registerListeners() {
    subscribe('name-changed', saveName);
    subscribe('name-changed', displayName);

    subscribe('config-changed', saveConfig);
    subscribe('config-changed', displayConfig);
}

/**
 *   Do some setup for config so it can be opened and closed.
 */
function enableOptions() {
    let config = document.querySelector('#options');
    let wheel = document.querySelector('#cog');
    wheel.addEventListener('click', function() {
        config.style.display = 'block';
    });
    let close = document.querySelector('#close-options');
    close.addEventListener('click', function() {
        config.style.display = 'none';
    })
}

/**
 *   Resizes the input to exactly fit the current size of the name and displays it.
 *   @param  {string} name [description]
 */
function displayName(name) {
    let nameInput = document.querySelector('#name-input');
    let nameSpan = document.querySelector('#name-js');
    nameSpan.innerHTML = name;
    let width = window.getComputedStyle(nameSpan).width;
    nameInput.value = name;
    nameInput.style.width = width;
}

/**
 *   Saves a given name.
 *   @param  {string} name [description]
 */
function saveName(name) {
    localStorage.setItem('name', name);
}

/**
 *   Displays a given config.
 *   @param  {object} config [description]
 */
function displayConfig(config) {
    var langInput = document.querySelector('#lang-select');
    langInput.value = config.language || 'english';
}

/**
 *   Save a given config object.
 *   @param  {object} config [description]
 */
function saveConfig(config) {
    localStorage.setItem('config', JSON.stringify(config));
}

init();
