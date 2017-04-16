$(document).ready(function() {
	createNewsFrame();
	createGraph();
	createWordcloud();
});

function createNewsFrame(param) {
	domainURL = $("#domain-url").val();
	sortBy = "toneasc";

	if (param === "tonedesc") { 
		sortBy = "tonedesc"; 
	} else if (param === "date") {
		sortBy = "date";
	}

	src = "http://api.gdeltproject.org/api/v1/search_ftxtsearch/search_ftxtsearch?query=domain:" + domainURL + "&sortby:" + sortBy + "&output=artlist&dropdup=true";
	console.log(src);
    $("#domain-content").html('<iframe src=' + src + ' style="width: 100%; height: 300px; border: none;"></iframe>');  
}

function createWordcloud() {
	query = $("#word-search").val();

	src = "http://api.gdeltproject.org/api/v1/search_ftxtsearch/search_ftxtsearch?query=" + query + "&sourcecountry:mexico&output=wordcloud&outputtype=native";

    $("#wordcloud-content").html('<iframe src=' + src + ' style="width: 500px; height: 500px; border: none;"></iframe>');  
}


function createGraph(param) {
	varToShow = "protest";

	if (param === "instability") { 
		varToShow = "instability"; 
	} else if (param === "conflict") {
		varToShow = "conflict";
	} else if (param === "tone") {
		varToShow = "tone";
	} else if (param === "artvolnorm") {
		varToShow = "artvolnorm";
	}

	src = "http://api.gdeltproject.org/api/v1/dash_stabilitytimeline/dash_stabilitytimeline?LOC=MX07&VAR=" + varToShow + "&OUTPUT=viz&TIMERES=day&SMOOTH=5"
	console.log(src);
    $("#graph-content").html('<iframe src=' + src + ' style="width:100%; height: 500px; border: none;"></iframe>');  
}

function makeFrame() {
	var ifrm = document.createElement("IFRAME");
	var myKey_id=document.getElementById('viewWordCloud').elements['myKey'].value
	ifrm.setAttribute("src", "http://api.gdeltproject.org/api/v1/search_ftxtsearch/search_ftxtsearch?query=" + myKey_id + "&sourcecountry:mexico&output=wordcloud&outputtype=native");
	ifrm.style.width = 500 + "px";
	ifrm.style.height = 500 + "px";
	document.body.appendChild(ifrm);
}