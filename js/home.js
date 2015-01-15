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
    hourlyTasks();
	minutlyTasks();
    hourInterval = setInterval(hourlyTasks, 3600000);
	minuteInterval = setInterval(minutlyTasks, 1000);
    registerHooks();
});

function registerHooks() {
    $("#search-js").keypress(search);
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
	if(name !== undefined && name !== null && name !== '') {
		document.getElementById('name-input').value = name;
		resizeName();
	}
	//Check which background image should be used.
	displayNextImage();
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
	
	Keep in mind that sync storage is working asynchronously.
*/
function initData() {
	var limageIndex = localStorage.getItem('imageIndex');
	if(limageIndex !== undefined && limageIndex !== null) imageIndex = limageIndex;
	var llastInc = localStorage.getItem('lastInc');
	if(llastInc !== undefined && llastInc !== null) lastInc = llastInc;
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
german.default = "Hallo";
german.saved = "Gespeichert";
german.save = "Speichern";
german.options = "Optionen";

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
english.saved = "Saved";
english.save = "Save";
english.options = "Options";

var dutch = [
	{
		greeting: "Goedemorgen",
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
dutch.saved = "Gered";
dutch.save = "Sparen";
dutch.options = "Opties";

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
french.saved = "Sauvé";
french.save = "Sauver";
french.options = "Options";


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
		if(term.indexOf("!w ") > -1) {
			term = term.replace("!w", "!w.en");
		}
		if(term.match(/!w\.?.*/) !== null) {
			term = term.replace(/!w\.*/, "");
			if(term.indexOf(" ") === 2) {
				//We have a two cha long identifier for languages.
				var id = term.substr(0,2);
				term = term.substring(3);
				form.action='http://' + id + '.wikipedia.org/wiki/' + term;
            	$('#searchTerm-js').val("");
				form.submit();	
			}
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
       /* form.action="http://google.com/search";
        $("#searchTerm-js").val(term);
        form.method="GET";
        form.submit();*/
    }
}

function resizeName(e) {
	var $input = $('#name-input');
	var $span = $('#name-js');
	var val = $input.val();
	$span.text(val);
	$input.css('width', $span.css('width'));
	chrome.storage.sync.set({'name': val});
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
		src: 'backgrounds/6830946505_494e7aafb2_o.jpg',
		desc: 'Ayr, Scotland',
		credit: 'Graeme Law',
		link: 'https://www.flickr.com/photos/14534290@N04/6830946505/'
	},
	{
		src: 'backgrounds/8369468069_2f7a342bcf_k.jpg',
		desc: 'Bixad, Romania',
		credit: 'János Csongor Kerekes',
		link: 'https://www.flickr.com/photos/30420396@N03/8369468069/'
	},
	{
		src: 'backgrounds/2904369145_daf89c90f2_o.jpg',
		desc: 'Lake in Colorado',
		credit: 'ellenm1',
		link: 'https://www.flickr.com/photos/47051377@N00/2904369145/'
	},
	{
		src: 'backgrounds/14392592291_d8f102a7ae_k.jpg',
		desc: 'Lake in Idaho',
		credit: 'megaguilarphotography',
		link: 'https://www.flickr.com/photos/megaguilarphotography/14392592291/in/photostream/'
	},
	{
		src: 'backgrounds/farm1.png',
		desc: 'Grand Tetons, Wyoming',
		credit: 'Jace Flournoy',
		link: 'http://i1248.photobucket.com/albums/hh495/Skitstep/farm1.png'
	},
	{
		src: 'backgrounds/grandteton.png',
		desc: 'Grand Tetons, Wyoming',
		credit: 'Jace Flournoy',
		link: 'http://i1248.photobucket.com/albums/hh495/Skitstep/grandteton.png'
	},
	{
		src: 'backgrounds/4748081550_afd101e13b_o.jpg',
		desc: 'Millstone, New Jersey',
		credit: 'b k',
		link: 'https://www.flickr.com/photos/30201239@N00/4748081550/'
	},
	{
		src: 'backgrounds/8280717520_6827a9d8f3_o.jpg',
		desc: 'Dublin, Ireland',
		credit: 'Nicolas Raymond',
		link: 'https://www.flickr.com/photos/82955120@N05/8280717520/'
	},
	{
		src: 'backgrounds/8527726214_0f49a48da7_o.jpg',
		desc: 'Sinalia, Romania',
		credit: 'fusion-of-horizons',
		link: 'https://www.flickr.com/photos/9019841@N08/8527726214/'
	},
	{
		src: 'backgrounds/256892528_8c52ec7efe_o.jpg',
		desc: 'Blakeslee, Pennsylvania',
		credit: 'Nicholas A. Tonelli',
		link: 'https://www.flickr.com/photos/14922165@N00/256892528/'
	},
	{
		src: 'backgrounds/15195195168_b323b238a5_o.jpg',
		desc: 'Deschutes, Oregon',
		credi: 'Sheila Sund',
		link: 'https://www.flickr.com/photos/90692748@N04/15195195168/'
	},
	{
		src: 'backgrounds/15195213694_16249d87b3_o.jpg',
		desc: 'National Arboretum, Washington D.C.',
		credit: 'Nicolas Raymond',
		link: 'https://www.flickr.com/photos/82955120@N05/15195213694/'
	},
	{
		src: 'backgrounds/9962065613_0f3e565e9d_o.jpg',
		desc: 'Dungeness, England',
		credit: 'Simon & His Camera',
		link: 'https://www.flickr.com/photos/46267286@N07/9962065613/'
	},
	{
		src: 'backgrounds/7479317540_6b27ab7f42_o.jpg',
		desc: 'St. Ives, England',
		credit: 'Nana B Agyei',
		link: 'https://www.flickr.com/photos/32876353@N04/7479317540/'
	},
	{
		src: 'backgrounds/3017515135_3efd8cfea9_o.jpg',
		desc: 'St Lawrence Market, Toronto',
		credit: 'paul bica',
		link: 'https://www.flickr.com/photos/99771506@N00/3017515135/'
	},
	{
		src: 'backgrounds/4047744775_f72ddb1fe6_o.jpg',
		desc: 'Dundas Peak, Burlington',
		credit: 'paul bica',
		link: 'https://www.flickr.com/photos/99771506@N00/4047744775/'
	},
	{
		src: 'backgrounds/3516991571_c30767ea25_o.jpg',
		desc: 'Kota Baharu, Kelantan',
		credit: 'Fayez Closed Account.',
		link: 'https://www.flickr.com/photos/22784594@N07/3516991571/'
	},
	{
		src: 'backgrounds/14813605612_fb2465b29e_o.jpg',
		desc: 'Cairndow, Scotland',
		credit: 'Gary Crawford.',
		link: 'https://www.flickr.com/photos/95406158@N00/14813605612/'
	},
	{
		src: 'backgrounds/4080392332_6e3835b488_o.jpg',
		desc: 'Sutton, Ontario',
		credit: 'Paul Bica.',
		link: 'https://www.flickr.com/photos/99771506@N00/4080392332/'
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