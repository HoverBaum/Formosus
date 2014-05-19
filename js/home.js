hourInterval = null;

//-------------------------------------------------------------
/*
    Initialisations
*/
//-------------------------------------------------------------

$(document).ready(function() {
    updateGreeting();
    hourInterval = setInterval(updateGreeting, 60000)
    registerHooks();
});

function registerHooks() {
    $("#search-js").keypress(search);
	/*$(".extendable").each(function() {
		$(this).mouseenter(function() {
			console.log("enter");
		});
		$(this).mouseleave(function() {
			console.log("leave");
		});
	});*/
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
    Searching
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

//---------------------------------------------------------------------
//  Calender
//  https://www.google.com/calendar/feeds/gemret%40gmail.com/public/full-noattendees
//---------------------------------------------------------------------