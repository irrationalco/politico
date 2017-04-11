$(document).ready(function() {
	createNewsFrame();
});

function createNewsFrame() {
	domainURL = $("#domain-url").val();

	src = "http://api.gdeltproject.org/api/v1/search_ftxtsearch/search_ftxtsearch?query=domain:" + domainURL + " &sortby:toneasc&output=artlist&dropdup=true"
    $("#domain-content").html('<iframe src=' + src + ' style="width: 100%; height: 300px; border: none;"></iframe>');  
}

function makeFrame() {
	var ifrm = document.createElement("IFRAME");
	var myKey_id=document.getElementById('viewWordCloud').elements['myKey'].value
	ifrm.setAttribute("src", "http://api.gdeltproject.org/api/v1/search_ftxtsearch/search_ftxtsearch?query=" + myKey_id + "&sourcecountry:mexico&output=wordcloud&outputtype=native");
	ifrm.style.width = 500 + "px";
	ifrm.style.height = 500 + "px";
	document.body.appendChild(ifrm);
}