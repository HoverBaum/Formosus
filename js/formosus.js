const localStorage = window.localStorage;

/**
 *   Configuration object, storring users preferences.
 *   @type {Object}
 */
var config = {
    language: 'english'
}

function init() {
    transformDOMEvents();
    registerListeners();

    loadData();
    enableOptions();

    intervalTasks();
    setInterval(intervalTasks, 2000);
}

/**
 *   Load users name and config data.
 */
function loadData() {

    //Users name.
    loadName();

    //Users config.
    loadConfig();
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
        emit('language-changed', config.language);
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

    subscribe('language-changed', updateLanguageStrings);
    subscribe('language-changed', calculateGreeting);

    subscribe('greeting-changed', displayGreeting);
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

/***********************
        The users name
 ***********************/

/**
 *   Will load the users name.
 *   Local storage is used for faster loading but chromes storage beats local.
 */
function loadName() {

    //First get local storage name to have it right now.
    let name = 'Friend';
    let localName = localStorage.getItem('name');
    if (localName) {
        name = localName;
    }
    emit('name-changed', name);

    //Then check chrom storage.
    if(!chrome.storage) return;
    chrome.storage.sync.get(['name'], function(item) {

        if (item.name) {
            name = item.name;
            emit('name-changed', name);
        }
    });

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

/**********************
        Config object
 **********************/

/**
 *   Will load the users config.
 *   Local storage is used for faster loading but chromes storage beats local.
 */
function loadConfig() {

    //First local.
    let localConfig = JSON.parse(localStorage.getItem('config'));
    if (localConfig !== undefined) {
        config = localConfig;
    }
    emit('config-changed', config);

    //Then check chrom storage.
    if(!chrome.storage) return;
    chrome.storage.sync.get(['config'], function(item) {
        if (item.config) {
            config = item.config;
            emit('config-changed', config);
            emit('language-changed', config.language);
        }
    });

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

/**
 *   Execute all tasks that should be regularly executed.
 */
function intervalTasks() {
    calculateGreeting();
    displayTime();
}

init();
