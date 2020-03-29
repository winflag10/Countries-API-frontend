
function initialLoad(){
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == XMLHttpRequest.DONE){
		  	let response = JSON.parse(xmlhttp.responseText);
		  	for (let i = 0; i < response.length; i++) { 
		  		var cardTemplate = `<div class="card" onclick="openDetails(this.children[1].firstElementChild)">
	<img src=${response[i].flag}>
	<div class="card-content">
		<h1>${response[i].name}</h1>
		<p>Population: <span>${response[i].population}</span></p>
		<p>Region: <span>${response[i].region}</span></p>
		<p>Capital: <span>${response[i].capital}</span></p>
	</div>
</div>`
				var holder = document.getElementById("card-holder")
				holder.innerHTML += cardTemplate
			}
			document.getElementById("card-loader").style.display= "none"
			document.getElementById("card-holder").style.display= "flex"
	  	}
	};
	xmlhttp.open("get", "https://restcountries.eu/rest/v2/all?fields=name;capital;population;region;flag", true);
	xmlhttp.send();
}


function updateLoad(e){

	var filter = document.getElementById("active-filter").innerHTML
	var holder = document.getElementById("card-holder")

	holder.style.display= "none"
	holder.innerHTML = ""

	document.getElementById("card-loader").style.display= "block"
	document.getElementById("no-results-container").style.display= "none"

	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == XMLHttpRequest.DONE){
		  	let response = JSON.parse(xmlhttp.responseText);
		  	for (let i = 0; i < response.length; i++) { 
		  		if (response[i].region == filter || filter == "No Filter" || filter == "Filter by region"){
		  			var cardTemplate = `<div class="card" onclick="openDetails(this.children[1].firstElementChild)">
	<img src=${response[i].flag}>
	<div class="card-content">
		<h1>${response[i].name}</h1>
		<p>Population: <span>${response[i].population}</span></p>
		<p>Region: <span>${response[i].region}</span></p>
		<p>Capital: <span>${response[i].capital}</span></p>
	</div>
</div>`
					holder.innerHTML += cardTemplate
				}
			}
			document.getElementById("card-loader").style.display= "none"
			if(response[0] !== undefined){
				document.getElementById("card-holder").style.display= "flex"
			}else{
				document.getElementById("no-results-container").style.display= "flex"
			}
	  	}
	};
	if(e.value != ""){
		xmlhttp.open("get", `https://restcountries.eu/rest/v2/name/${e.value}?fields=name;capital;population;region;flag`, true);
	}else{
		xmlhttp.open("get", "https://restcountries.eu/rest/v2/all?fields=name;capital;population;region;flag", true);
	}
	xmlhttp.send();
}

function openDetails(e){
	var name = e.innerHTML
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == XMLHttpRequest.DONE){
		  	let response = JSON.parse(xmlhttp.responseText)[0];

		  	//Once responce is recieved fill in left side details
		  	document.getElementById("details-flag").src = response.flag
		  	document.getElementById("details-name").innerHTML = response.name
		  	document.getElementById("nativeName").innerHTML = response.nativeName
		  	document.getElementById("population").innerHTML = response.population
		  	document.getElementById("region").innerHTML = response.region
		  	document.getElementById("sub-region").innerHTML = response.subregion
		  	document.getElementById("capital").innerHTML = response.capital
		  	document.getElementById("tld").innerHTML = response.topLevelDomain

		  	//parse and fill in currecies
		  	currencies = response.currencies
		  	if(currencies == undefined){
		  		document.getElementById("currencies").innerHTML = "None"
		  	}else{
		  		for(let i = 0; i < currencies.length; i++) { 
		  			currencies[i] = currencies[i].name
		  		}
		  		document.getElementById("currencies").innerHTML = response.currencies.toString()
		  	}

		  	//parse and fill in languages
		  	languages = response.languages
		  	if(languages == undefined){
		  		document.getElementById("languages").innerHTML = "None"
		  	}else{
		  		for(let i = 0; i < languages.length; i++) { 
		  			languages[i] = languages[i].name
		  		}
		  		document.getElementById("languages").innerHTML = response.languages.toString()
		  	}

		  	//Load border countries
		  	document.getElementById("details-border-container").innerHTML = "<p id='border-country-p'>Border Countries: </p>"
		  	if (response.borders.length == 0){
		  		document.getElementById("details-border-container").innerHTML += "<span style='margin-left:5px;'> None</span>"
		  	}else{
		  		for(let i = 0; i < response.borders.length; i++) { 
		  			document.getElementById("details-border-container").innerHTML += `<div class="border-country" onclick="openDetails(this.children[0])">
	<p>${response.borders[i]}</p>
</div>`
		  		}
		  		getNames();
		  	}
		  	

		  	//set correct screen to visible
		  	document.getElementById("main-screen").style.display="none";
			document.getElementById("detail-screen").style.display="flex";
	  	}
	};
	xmlhttp.open("get", `https://restcountries.eu/rest/v2/name/${name}`, true);
	xmlhttp.send();
}

function back(){
	document.getElementById("main-screen").style.display="block";
	document.getElementById("detail-screen").style.display="none";
}


function getNames(){
	var borders = document.getElementById("details-border-container")
	for(let i = 1; i < borders.children.length; i++) { 
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE){
			  	let response = JSON.parse(xmlhttp.responseText);
			  	borders.children[i].children[0].innerHTML = response.name
			  	
		  	}
		};
		xmlhttp.open("get", `https://restcountries.eu/rest/v2/alpha/${borders.children[i].children[0].innerHTML}?fields=name;`, true);
		xmlhttp.send();
	}

}


function toggleDropdown(){
	options = document.getElementById("filter-options")
	if(options.style.display == "flex"){
		options.style.display = "none"
		document.getElementById("filter-icon").style.transform = "rotate(0deg)"
	}else{
		options.style.display = "flex"
		document.getElementById("filter-icon").style.transform = "rotate(180deg)"
	}
}

function chooseFilter(e){
	document.getElementById("active-filter").innerHTML = e.children[0].innerHTML
	updateLoad(document.getElementById("search"))
}