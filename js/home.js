hourInterval = null;	//Intervall for hourly tasks.
images = null;			//Array of currently used images.
name = '';				//Name of the user.
imageIndex = null;			//Index of currently used image.
lastInc = null;			//Last day the imageIndex was incremented.
lang = 'german';		//Which language to use.
var greetings = [];		//The different greetings.

//-------------------------------------------------------------
/*
    Initialisations
*/
//-------------------------------------------------------------

$(document).ready(function() {
	images = general;
	initData();
	setup();
	resizeName();
    hourlyTasks();
	minutlyTasks();
    hourInterval = setInterval(hourlyTasks, 3600000);
	minuteInterval = setInterval(minutlyTasks, 60000);
    registerHooks();
});

function registerHooks() {
    $("#search-js").keypress(search);
	$('#name-input').keyup(resizeName);
}

/*
	Sets up stuff, like name.
*/
function setup() {
	//Display the users name.
	if(name !== undefined && name !== null && name !== '') {
		document.getElementById('name-input').value = name;
	}
	//Check which background image should be used.
	displayNextImage();
	//Set the alnguage array.
	initGreetings();
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
}

/*
	Displays the next image according to the index.
*/
function displayNextImage() {
	var today = new Date().getDay();
	if(lastInc !== null) {
		//Check for index here, so we can set it below if need be.
		if(lastInc == today && imageIndex !== null) {
			return;
		}
	}
	if(imageIndex === null) {
		imageIndex = Math.ceil(Math.random() * images.length) - 1;
	}
	imageIndex++;
	if(imageIndex >= images.length) imageIndex = 0;
	updateBackground();
	lastInc = today;
	localStorage.setItem('imageIndex', imageIndex);
	localStorage.setItem('lastInc', lastInc);
}

/*
	Initializes variables that may be stored locally.
*/
function initData() {
	var lname = localStorage.getItem('name');
	if(lname !== undefined && lname !== null) name = lname;
	var limageIndex = localStorage.getItem('imageIndex');
	if(limageIndex !== undefined && limageIndex !== null) imageIndex = limageIndex;
	var llastInc = localStorage.getItem('lastInc');
	if(llastInc !== undefined && llastInc !== null) lastInc = llastInc;
	var llang = localStorage.getItem('lang');
	if(llang !== undefined && llang !== null) lang = llang;
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
	updateBackground();
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

var german = [
	{
		greeting: "Guten Morgen",
		start: 6,
		end: 11
	},
	{
		greeting: "Guten Nachmittag",
		start: 14,
		end: 18
	},
	{
		greeting: "Guten Abend",
		start: 19,
		end: 23
	}
];
german .default = "Hallo";

var english = [
	{
		greeting: "Good morning",
		start: 6,
		end: 11
	},
	{
		greeting: "Good afternoon",
		start: 14,
		end: 18
	},
	{
		greeting: "Good evening",
		start: 19,
		end: 23
	}
];
english.default = "Hello";

var dutch = [
	{
		greeting: "Goedmorgen",
		start: 6,
		end: 11
	},
	{
		greeting: "Goedmiddag",
		start: 14,
		end: 18
	},
	{
		greeting: "Goedeavond",
		start: 19,
		end: 23
	}
];
dutch.default = "Hallo";

var french = [
	{
		greeting: "Bonjour",
		start: 6,
		end: 11
	},
	{
		greeting: "Bonjour",
		start: 14,
		end: 18
	},
	{
		greeting: "Bonsoir",
		start: 19,
		end: 23
	}
];
french.default = "Salut";

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
	/*
    if(h < 6) return greetings[0];
    if(h < 11) return greetings[1];
    if(h < 14) return greetings[2];
    if(h < 18) return greetings[3];
    if(h < 19) return greetings[4];
    if(h < 23) return greetings[5];
	*/
}

//--------------------------------------------------------------
/*
    Hooked to inputs
*/  
//-----------------------------------------------------------------
    
function search(e) {
    if(e.charCode != 13) return;
    var term = $("#search-js").val();
    var form = document.getElementById("searchForm");
    if(term.indexOf("!") === 0){
        if(term.indexOf("!w.de ") > -1) {
            term = term.replace("!w.de ", "");
            form.action="http://en.wikipedia.org/wiki/" + term;
            $("#searchTerm-js").val("");
            form.submit();
        }else if(term.indexOf("!w ") > -1) {
            term = term.replace("!w ", "");
            form.action="http://en.wikipedia.org/wiki/" + term;
            $("#searchTerm-js").val("");
            form.submit();
        }
        if(term.indexOf("!y ") > -1) {              //want to search youtube
            term = term.replace("!y ", "");         //take away the "command"
            form.action="http://youtube.com/results";//set URL
            $("#searchTerm-js").val(term);          //set what to search for
            $("#searchTerm-js").attr("name", "search_query"); //Change name of input
            form.method="GET";                      
            form.submit();                          //Do search
        }
    } else {
        form.action="http://google.com/search";
        $("#searchTerm-js").val(term);
        form.method="GET";
        form.submit();
    }
}

function resizeName(e) {
	var $input = $('#name-input');
	var $span = $('#name-js');
	var val = $input.val();
	$span.text(val);
	$input.css('width', $span.css('width'));
	localStorage.setItem('name', val);
}

//---------------------------------------------------------------------
/*
	Images
	
	Multiple arrays containing images.
	Each image is an object and build like:
		{
			src: link to image
			desc: a short (up to 4 words) description of the image
			credit: who deserves credit
			link: assuming CC, need to link to somewhere (like flickr)
		}
*/
//---------------------------------------------------------------------

var general = [
	{
		src: 'https://farm3.staticflickr.com/2946/15349166041_e2012546ec_k.jpg',
		desc: 'Autum forest',
		credit: 'Olli',
		link: 'https://www.flickr.com/photos/84814657@N04/15349166041/'
	},
	{
		src: 'https://farm8.staticflickr.com/7153/6830946505_494e7aafb2_o.jpg',
		desc: 'Ayr, Scotland',
		credit: 'Graeme Law',
		link: 'https://www.flickr.com/photos/14534290@N04/6830946505/'
	},
	{
		src: 'https://farm9.staticflickr.com/8233/8369468069_2f7a342bcf_k.jpg',
		desc: 'Bixad, Romania',
		credit: 'János Csongor Kerekes',
		link: 'https://www.flickr.com/photos/30420396@N03/8369468069/'
	},
	{
		src: 'https://farm4.staticflickr.com/3187/2904369145_daf89c90f2_o.jpg',
		desc: 'Lake in Colorado',
		credit: 'ellenm1',
		link: 'https://www.flickr.com/photos/47051377@N00/2904369145/'
	},
	{
		src: 'https://farm4.staticflickr.com/3891/14392592291_d8f102a7ae_k.jpg',
		desc: 'Lake in Idaho',
		credit: 'megaguilarphotography',
		link: 'https://www.flickr.com/photos/megaguilarphotography/14392592291/in/photostream/'
	},
	{
		src: 'http://i1248.photobucket.com/albums/hh495/Skitstep/farm1.png',
		desc: 'Grand Tetons',
		credit: 'Jace Flournoy',
		link: 'http://i1248.photobucket.com/albums/hh495/Skitstep/farm1.png'
	},
	{
		src: 'http://i1248.photobucket.com/albums/hh495/Skitstep/grandteton.png',
		desc: 'Grand Tetons',
		credit: 'Jace Flournoy',
		link: 'http://i1248.photobucket.com/albums/hh495/Skitstep/grandteton.png'
	}
]

/*
	Checks the current background image and updates it if need be.
*/
function updateBackground() {
	$('body').css('background-image', 'url('+ images[imageIndex].src +')');
	//Now update the credit.
	$('#credit-title').html(images[imageIndex].desc);
	$('#credit-author').html('by ' + images[imageIndex].credit);
	$('#credits').attr('href', images[imageIndex].link);
}

function testNextImage() {
	imageIndex++;
	if(imageIndex >= images.length) imageIndex = 0;
	updateBackground();
	lastInc = today;
	localStorage.setItem('imageIndex', imageIndex);
	localStorage.setItem('lastInc', lastInc);
}