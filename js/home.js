hourInterval = null;	//Intervall for hourly tasks.
name = '';				//Name of the user.
lang = 'english';		//Which language to use.
var greetings = [];		//The different greetings.

//-------------------------------------------------------------
/*
    Initialisations
*/
//-------------------------------------------------------------

$(document).ready(function() {
	initData();
	setup();
    hourlyTasks();
	minutlyTasks();
    hourInterval = setInterval(hourlyTasks, 3600000);
	minuteInterval = setInterval(minutlyTasks, 1000);
    registerHooks();
});

function registerHooks() {
	$('#name-input').keyup(resizeName);
	$('#cog').click(showOptions);
	$('#overlay').click(function(e) {
		if(e.target.id === "overlay") {
			$(this).fadeOut(300);
		}
	});
	$('#save-options').click(saveOptions);
}

/*
	Sets up stuff, like name.
*/
function setup() {

	//Display the users name.
	if(name !== undefined && name !== null && name !== '     ') {
		document.getElementById('name-input').value = name;
		resizeName();

	}
}

/*
	A function to set teh greetings array.
*/
function initGreetings() {

	//Yes we use many ifs, because eval is to dangerous for Chrome extensions and to lazy for sandbox
	//https://developer.chrome.com/extensions/sandboxingEval
	if(lang === 'german'){
		greetings = german;
	} else if(lang === 'english') {
		greetings = english;
	} else if(lang === 'french') {
		greetings = french;
	} else if(lang === 'dutch') {
		greetings = dutch;
	}
	updateGreeting();
	localize();
}

/*
	Replaces string according to language.
*/
function localize() {
	document.getElementById('saved-text').innerHTML = greetings.saved;
	document.getElementById('save-options').innerHTML = greetings.save;
	document.getElementById('lang-options').innerHTML = greetings.options;
}

/*
	Initializes variables that may be stored locally.

	Keep in mind that sync storage is working asynchronously.
*/
function initData() {
	chrome.storage.sync.get(['lang', 'name'], function(item) {
		console.log(item);

		//Check for name.
		if(item.name) {
			name = item.name;
			document.getElementById('name-input').value = name;
			resizeName();
		}

		//Check for language.
		if(item.lang) {
			lang = item.lang;
			initGreetings();
		}
	});
}

/*
	Display the option to change languages.
*/
function showOptions() {
	$('#overlay').fadeIn(300);
	$('#lang-select').val(lang);
}

/*
	Save the selected options.
*/
function saveOptions() {
	console.debug("saving options")

	//Save selected language
	lang = $('#lang-select').val();
	initGreetings();
	console.debug("new lang "+ lang)
	chrome.storage.sync.set({'lang': lang}, function() {

		//Let user know it worked.
		settingsSaved();
	});
}

/*
	Gives the user feedback that settings are saved.
*/
function settingsSaved() {
	$('#overlay').fadeOut(300);
	$('#save-overlay').fadeIn(300);

	//Wait 1sec and fade out the feedback.
	setTimeout(function() {
		$('#save-overlay').fadeOut(300);
	}, 1000);
}

/*
===================================================================================0
	Periodic starting of tasks.

*/

/*
	Runs everything that need to run every hour.
*/
function hourlyTasks() {
	updateGreeting();
}

function minutlyTasks() {
	updateTime();
}

/*
	Update the displayed time.
*/

function updateTime() {
	var now = new Date();
	var time = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
	$('#time-js').html(time);
}

//-----------------------------------------------------------
/*
    Greeting
    Everything needed to set the Greeting according to hour.
*/
//-----------------------------------------------------------

function updateGreeting() {
    var date = new Date;
    var h = date.getHours();
    var greet = generateGreeting(h);
    $("#greeting-js").text(greet);
}

function generateGreeting(h) {
	if(greetings.length === 0 && greetings.default === undefined) {
		return 'Hello';	//Standard english greeting if none present.
	}
	var greeting = '';
	for(var i = 0; i < greetings.length; i++) {
		var elm = greetings[i];
		if(elm.start <= h && elm.end > h) {
			greeting = elm.greeting;
		}
	}
	if(greeting === '') {
		greeting = greetings.default;
	}
	return greeting;
}

//--------------------------------------------------------------
/*
    Hooked to inputs
*/
//-----------------------------------------------------------------

function resizeName(e) {
	var $input = $('#name-input');
	var $span = $('#name-js');
	var val = $input.val();
	$span.text(val);
	$input.css('width', $span.css('width'));
	chrome.storage.sync.set({'name': val});
}
