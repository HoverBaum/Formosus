hourInterval = null;	//Intervall for hourly tasks.
images = null;			//Array of currently used images.
name = '';				//Name of the user.
imageIndex = null;			//Index of currently used image.
lastInc = null;			//Last day the imageIndex was incremented.



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

function updateGreeting() {
    var date = new Date;
    var h = date.getHours();
    var greet = generateGreeting(h);
    $("#greeting-js").text(greet);
}

function generateGreeting(h) {
    if(h < 6) return "Hallo";
    if(h < 11) return "Guten Morgen";
    if(h < 14) return "Hallo";
    if(h < 18) return "Guten Nachmittag";
    if(h < 19) return "Hallo";
    if(h < 23) return "Guten Abend";
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
	}
]

/*
	Checks the current background image and updates it if need be.
*/
function updateBackground() {
	$('body').css('background-image', 'url('+ images[imageIndex].src +')');
}

function testNextImage() {
	imageIndex++;
	if(imageIndex >= images.length) imageIndex = 0;
	updateBackground();
	lastInc = today;
	localStorage.setItem('imageIndex', imageIndex);
	localStorage.setItem('lastInc', lastInc);
}