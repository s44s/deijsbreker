(function(){

	"use strict"

	var app = {
		init: function(){
			eventHandlers.change();
		}
	}

	var getSelectInput = {
	}

	var eventHandlers = {
		change: function(){
			var form = document.querySelector('form');
			var select = document.querySelector('select');
			form.addEventListener("submit", function(e){
				e.preventDefault();
				var selectValue = select.value;
				var year = (new Date()).getFullYear() - (Number(selectValue) + 5);
				getCurrentLocation.init(year);
				// getDataAnswer.input(year);
			});
		}
	}

	var getCurrentLocation = {
		init: function(year){
			this.getLatLong(year);
		},
		getLatLong: function(year){
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition);
			} else {
				x.innerHTML = "Geolocation is not supported by this browser.";
			}

			function showPosition(position) {
				var long = position.coords.longitude;
				var lat = position.coords.latitude;

				//variables for circle
				var coords = [lat, long];
				var radius = 500;
				var numberOfEdges = 4;
				getCurrentLocation.toPolygon(coords, radius, numberOfEdges, year);
			}
		},
		toPolygon: function(coords, radius, numberOfEdges, year){

			function toRadians(angleInDegrees) {
				return angleInDegrees * Math.PI / 180;
			}

			function toDegrees(angleInRadians) {
				return angleInRadians * 180 / Math.PI;
			}

			function offset(c1, distance, bearing) {
				var lat1 = toRadians(c1[1]);
				var lon1 = toRadians(c1[0]);
				var dByR = distance / 6378137; // distance divided by 6378137 (radius of the earth) wgs84
				var dByR2 = (distance * 1.65) / 6378137; // distance divided by 6378137 (radius of the earth) wgs84
				var lat = Math.asin(
					Math.sin(lat1) * Math.cos(dByR2) +
					Math.cos(lat1) * Math.sin(dByR2) * Math.cos(bearing));
				var lon = lon1 + Math.atan2(
						Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1),
						Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat));
				return [toDegrees(lon), toDegrees(lat)];
			}

			var n = numberOfEdges ? numberOfEdges : 32;
			var flatCoordinates = [];
			var coordinates = [];
			for (var i = 0; i < n; ++i) {
				flatCoordinates.push.apply(flatCoordinates, offset(coords, radius, 2 * Math.PI * i / n));
			}
			flatCoordinates.push(flatCoordinates, flatCoordinates[1]);

			for (var i = 0, j = 0; j < flatCoordinates.length; j += 2) {
				coordinates[i++] = flatCoordinates.slice(j, j + 2);
			}
			this.toWKT(coordinates.reverse(), year);
		},
		toWKT: function(coordinates, year){
			var wkt = `POLYGON((${coordinates[1][1]} ${coordinates[1][0]}, ${coordinates[2][1]} ${coordinates[2][0]}, ${coordinates[3][1]} ${coordinates[3][0]}, ${coordinates[4][1]} ${coordinates[4][0]}))`
			getDataAnswer.input(wkt, year);
		}
	}

	var getDataAnswer =  {
		input: function(wkt, year) {
			var wkt = wkt;
			var year = year;
			this.request(wkt, year)
		},
		request: function(wkt, year) {
			var newWKT = wkt;
			var beginYear = year;
			var currentYear = new Date().getFullYear();

			var beginTimestamp = `${beginYear}-01-01`;
			var endTimestamp = `${currentYear}-12-31`;
			var staticWKT = `POLYGON((4.898873550546993 52.370216,4.895167989737426 52.36796199028077,4.891462449453007 52.370216,4.895167989737426 52.37247000971923,4.898873550546993 52.370216))`;

			var sparqlquery = `
			PREFIX dct: <http://purl.org/dc/terms/>
			PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX void: <http://rdfs.org/ns/void#>
      PREFIX hg: <http://rdf.histograph.io/>
      PREFIX geo: <http://www.opengis.net/ont/geosparql#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      # SELECT ?title ?img ?start ?end ?street ?streetLabel WHERE {
			SELECT DISTINCT(?img) ?title ?start ?street ?streetLabel ?end WHERE {
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

        # spatial filter
        ?cho dct:spatial ?street .
        ?street a hg:Street ;
        geo:hasGeometry/geo:asWKT ?streetWkt ;
        rdfs:label ?streetLabel .
        BIND (bif:st_geomfromtext("${newWKT}") as ?x)
        BIND (bif:st_geomfromtext(?streetWkt) AS ?y)
        FILTER(bif:GeometryType(?y)!='POLYGON' && bif:st_intersects(?x, ?y))
      }
      ORDER BY ?start
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
			console.log('loader stop');
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
			Transparency.render(target, data, directives)
			function sliderInit(){
					$('.answer').slick({
						variableWidth: true,
						autoplay: true,
						autoplaySpeed: 5000,
						slidesToShow: 1,
						centerMode: true,
						pauseOnHover: false,
						lazyLoad: 'progressive'
				});
			};
			sliderInit();
			loader.hide()
		}
	}

	// Start the application
	app.init()
})()
