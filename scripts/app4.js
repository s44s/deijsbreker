(function(){

	"use strict"

	var app = {
		init: function(){
			eventHandlers.change();
		}
	}

	var eventHandlers = {
		change: function(){
			var form = document.querySelector('header form');
			var select = document.querySelector('select');
			form.addEventListener("submit", function(e){
				e.preventDefault();
				var radios = form.elements;
				var val;
				for(var i=0, len=radios.length; i<len; i++) {
					if(radios[i].checked) { // radio checked?
						val = radios[i].value; // if so, hold its value in val
						break; // and break out of for loop
					}
				}

				var selectValue = val
				getParameters.init(val);

			});
		}
	}

	var getParameters = {
		init: function(value){
			getDataAnswer.input(value);
		}
	}

	var getDataAnswer =  {
		input: function(value) {
			this.request(value)
		},
		request: function(value) {
			var beginTimestamp = `${value}-01-01`;
			var next = Number(value) + 9;
			var endTimestamp = `${next}-12-31`;

			var sparqlquery = `
			PREFIX dct: <http://purl.org/dc/terms/>
			PREFIX foaf: <http://xmlns.com/foaf/0.1/>
			PREFIX void: <http://rdfs.org/ns/void#>
			PREFIX hg: <http://rdf.histograph.io/>
			PREFIX geo: <http://www.opengis.net/ont/geosparql#>
			PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
			PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
			PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
			PREFIX dc: <http://purl.org/dc/elements/1.1/>
			PREFIX edm:    <http://www.europeana.eu/schemas/edm/>

			SELECT ?title ?img ?start ?end WHERE {

			 # basic data
			  ?cho dc:title ?title .
			  ?cho foaf:depiction ?img .

			  # temporal filter
			  ?cho sem:hasBeginTimeStamp ?orgStart .
			  ?cho sem:hasEndTimeStamp ?orgEnd .
			  BIND (xsd:date(str(?orgStart)) AS ?start)
			  BIND (xsd:date(str(?orgEnd)) AS ?end)
			  FILTER BOUND (?start)
			  FILTER BOUND (?end)
			  FILTER (?start >= xsd:date("${beginTimestamp}") && ?end <= xsd:date("${endTimestamp}") )

			  # type filter
			  ?cho dc:type <http://vocab.getty.edu/aat/300027221> . #affiche

			  # subject filter
			  ?cho dc:subject "Music."^^xsd:string

			}
			`;
			var encodedquery = encodeURIComponent(sparqlquery);
			//https://api.data.adamlink.nl/datasets/AdamNet/all/services/hva2018/sparql
			//https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql
			var queryurl = 'https://api.data.adamlink.nl/datasets/AdamNet/Heritage/services/ijsbreker/sparql?default-graph-uri=&query=' + encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

			loader.show()

			fetch(queryurl)
			.then((resp) => resp.json()) // transform the data into json
				.then(function(data) {
					var rows = data.results.bindings; // get the results
					console.log(rows)
					template.renderImages(rows)

				}).catch(function(error) {
					// if there is any error you will catch them here
					console.log(error);
			});
		}
	}

	var loader = {
		show: function() {
			document.querySelector('main').classList.add('loader');
			var header = document.querySelector('header');
			header.style.display = "none";
		},
		hide: function() {
			document.querySelector('main').classList.remove('loader')
		}
	}

	var template = {
		renderImages: function(data){
			var target = document.querySelector(".answer");
			var directives = {
				year: {
					html: function(params) {
						return this.start.value
					}
				},
				description: {
					html: function(params) {
						return this.title.value
					}
				},
			  img: {
			    src: function(params) {
						var srcold = this.img.value;
						var srcnew = srcold.replace("http", "https")
						return srcnew
			    }
			  }
			}
			Transparency.render(target, data, directives);

			var images = document.querySelectorAll('.img');
			images.forEach(function(e){
				e.addEventListener('error', function(){
					e.src = 'images/error.png';
				})
			})

			function sliderInit(){
					$('.answer').slick({
						variableWidth: true,
						autoplay: true,
						autoplaySpeed: 100,
						slidesToShow: 1,
						centerMode: true,
						pauseOnHover: false,
						lazyLoad: 'progressive'
				});
			};

			function timeOut(){
				setTimeout(function(){
					$('.answer').slick('slickSetOption', 'autoplaySpeed', '5000');
				}, 100);
			}

			sliderInit();
			timeOut();
			loader.hide();
		}
	}

	// Start the application
	app.init()
})()
