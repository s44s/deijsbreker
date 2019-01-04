var lines= 0;
var maxlines= 24;

function init() {
    document.testform.t.value+= '';
    lines= 0;

    if (document.addEventListener) {
       document.addEventListener("keydown",keydown,false);
    }
		else if (document.attachEvent) {
       document.attachEvent("onkeydown", keydown);
    }
    else {
       document.onkeydown= keydown;
    }
}

function showmesg(t) {
  var old= document.testform.t.value;
  if (lines >= maxlines) {
  	var i= old.indexOf('\n');

	if (i >= 0)
    old= old.substr(i+1);
  }
  else
   	lines++;
		document.testform.t.value= old + t + '\n';
}

function keyval(n) {
    if (n == null) return 'undefined';
    var s= pad(3,n);
    if (n >= 32 && n < 127) s+= ' (' + String.fromCharCode(n) + ')';
    while (s.length < 9) s+= ' ';
    return s;
}

function keymesg(w,e){
    var row= 0;
    var head= [w, '        '];
		showmesg(keyval(e.keyCode));
		// console.log(keyval(e.keyCode).substr(0,2))

		// BEGINNING OF KEYS
		if(keyval(e.keyCode).substr(0,2) == 32){ //space
			var autoplay = $('.answer').slick('slickGetOption', 'autoplay');
			console.log(autoplay)
			if (autoplay == true){
				$('.answer').slick('slickSetOption', 'autoplay', 'false');
				$('.answer').slick('slickPause');
			} else {
				$('.answer').slick('slickSetOption', 'autoplay', 'true');
				$('.answer').slick('slickPlay');
			}
		}
		if(keyval(e.keyCode).substr(0,2) == 87){ //w
			var currenturl = window.location.href;
			var currentHTMLPage = currenturl.substr(currenturl.length - 6);
			var number = Number(currentHTMLPage.substr(0,1));
			var nextNumber = number + 1;
			if (nextNumber < 8){
				var splitPath = window.location.pathname.split("zender")[0];
				var newPath = splitPath + 'zender' + nextNumber.toString() + '.html'
				var newURL = window.location.hostname + window.location.pathname;
				window.location.href = newPath
				console.log(newPath)
			} else {
				var splitPath = window.location.pathname.split("zender")[0];
				var newPath = splitPath + 'zender1.html';
				window.location.href = newPath
			}
		}
		if(keyval(e.keyCode).substr(0,2) == 65){ //a
			var currenturl = window.location.href;
			var currentHTMLPage = currenturl.substr(currenturl.length - 6);
			var number = Number(currentHTMLPage.substr(0,1));
			var nextNumber = number - 1;
			if (nextNumber > 0){
				var splitPath = window.location.pathname.split("zender")[0];
				var newPath = splitPath + 'zender' + nextNumber.toString() + '.html'
				var newURL = window.location.hostname + window.location.pathname;
				window.location.href = newPath
				console.log(newPath)
			} else {
				var splitPath = window.location.pathname.split("zender")[0];
				var newPath = splitPath + 'zender7.html';
				window.location.href = newPath
			}
		}
		if(keyval(e.keyCode).substr(0,2) == 83){ //s
			$(".answer").slick('slickPrev')
		}
		if(keyval(e.keyCode).substr(0,2) == 68){ //d
			$(".answer").slick('slickNext')
		}
		if(keyval(e.keyCode).substr(0,2) == 70){ //f
			if(window.location.href.substr(window.location.href.length - 10) == 'index.html' || window.location.href.substr(window.location.href.length - 1) == '/'){
				var form = document.querySelector('.overlay form');
				var radios = form.elements;
				var selected = document.querySelectorAll('input[type="radio"]:checked');
				for(var i=0, len=radios.length; i<len; i++) {
					if(selected[0].value == radios[i].value) {
						if(i + 2 > radios.length){
							radios[i].checked = false;
							document.querySelector('input[name="radio1"]').checked = true;
						} else {
							var numberOld = i + 1;
							var numberNew = i + 2;
							radios[i].checked = false;
							document.querySelector('input[name="radio' + numberNew + '"]').checked = true;
							break; // and break out of for loop
						}
					}
				}
				var focus = document.querySelector('input:checked');
				var allRadio = document.querySelectorAll('input')
				allRadio.forEach(function(e){
					e.parentNode.children[1].style.opacity = 0.5
				})
				focus.parentNode.children[1].style.opacity = 1;

			}
			else {
				var form = document.querySelector('header form');
				var radios = form.elements;
				var selected = document.querySelectorAll('input[type="radio"]:checked');
				var div = document.querySelector('.first')
				for(var i=0, len=radios.length; i<len; i++) {
					if(selected[0].value == radios[i].value) {
						if(i > radios.length - 3){
							radios[i].checked = false;
							document.querySelector('input[name="radio1"]').checked = true;
						} else {
							var numberOld = i + 1;
							var numberNew = i + 2;
							radios[i].checked = false;
							document.querySelector('input[name="radio' + numberNew + '"]').checked = true;
							break; // and break out of for loop
						}
					}
				}
				//scroll down indicator
				var focus = document.querySelector('input:checked');
				var feedback = document.querySelector('p');
				var span = document.querySelector('span');
				var child = focus.parentNode;
				var parent = child.parentNode;
				var total = parent.children.length;
				var index = Array.prototype.indexOf.call(parent.children, child);
				var allRadio = document.querySelectorAll('input')
				feedback.innerHTML = index + 1 + '<span>/' + total + '</span>';

				//focus color
				allRadio.forEach(function(e){
					e.parentNode.style.backgroundColor = 'grey';
				})
				focus.parentNode.style.backgroundColor = 'red'

				//scroll down
				if (div.scrollHeight > div.offsetHeight) {
					if(focus.offsetTop + focus.offsetHeight > div.offsetHeight){
						focus.scrollIntoView();
						// console.log(div.scrollHeight, div.offsetHeight);
					} else {
						focus.scrollIntoView(false);
					}
				}

			}
		}
		if(keyval(e.keyCode).substr(0,2) == 71){ //g
			var autoplay = document.querySelector('.slick-slider')
			if(autoplay == null){
				if(window.location.href.substr(window.location.href.length - 10) == 'index.html' || window.location.href.substr(window.location.href.length - 1) == '/'){
					var selected = document.querySelectorAll('input[type="radio"]:checked');
					var value = selected[0].value;
					var splitPath = window.location.pathname.split("index")[0];
					var newPath = splitPath + value;
					window.location.href = newPath;
				} else{
					var submit = document.querySelector('button[type="submit"]');
					submit.click();
				}
			}
 		}
		if(keyval(e.keyCode).substr(0,2) == 0){ //pijl omlaag/omhoog/opzij/naarboven
			if(window.location.href.substr(window.location.href.length - 10) == 'index.html' || window.location.href.substr(window.location.href.length - 1) == '/'){
				var main = document.querySelector('main');
				if(main.style.display === "none"){

					var form = document.querySelector('.overlay form');
					var radios = form.elements;
					var selected = document.querySelectorAll('input[type="radio"]:checked');
					for(var i=0, len=radios.length; i<len; i++) {
						if(selected[0].value == radios[i].value) {
							if(i == 0){
								radios[i].checked = false;
								document.querySelector('input[name="radio' + (radios.length).toString() + '"]').checked = true;
							} else {
								var numberOld = i + 1;
								var numberNew = numberOld - 1;
								radios[i].checked = false;
								document.querySelector('input[name="radio' + numberNew + '"]').checked = true;
								break; // and break out of for loop
							}
						}
					}
					var focus = document.querySelector('input:checked');
					var allRadio = document.querySelectorAll('input')
					allRadio.forEach(function(e){
						e.parentNode.children[1].style.opacity = 0.5
					})
					focus.parentNode.children[1].style.opacity = 1;

				} else {
					var video = document.querySelector('video');
					main.style.display = "none";
					video.classList.add('fade-in');
					video.autoplay = true;
					video.play();
				}
			} else {
				var form = document.querySelector('header form');
				var radios = form.elements;
				var selected = document.querySelectorAll('input[type="radio"]:checked');
				var div = document.querySelector('.first')
				for(var i=0, len=radios.length; i<len; i++) {
					if(selected[0].value == radios[i].value) {
						if(i == 0){
							radios[i].checked = false;
							document.querySelector('input[name="radio' + (radios.length - 1).toString() + '"]').checked = true;
						} else {
							var numberOld = i + 1;
							var numberNew = numberOld - 1;
							radios[i].checked = false;
							document.querySelector('input[name="radio' + numberNew + '"]').checked = true;
							break; // and break out of for loop
						}
					}
				}
				// scroll down indicator
				var focus = document.querySelector('input:checked');
				var feedback = document.querySelector('p');
				var child = focus.parentNode;
				var parent = child.parentNode;
				var total = parent.children.length;
				var index = Array.prototype.indexOf.call(parent.children, child);
				var allRadio = document.querySelectorAll('input')
				feedback.innerHTML = index + 1 + '/' + total

				//focus color
				allRadio.forEach(function(e){
					e.parentNode.style.backgroundColor = 'grey';
				})
				focus.parentNode.style.backgroundColor = 'red'

				//scroll down
				if (div.scrollHeight > div.offsetHeight) {
					if(focus.offsetTop + focus.offsetHeight > div.offsetHeight){
						focus.scrollIntoView();
					} else {
						focus.scrollIntoView(false);
					}
				}

			}
		}
		// END OF KEYS
		row= 1;

}

function pad(n,s) {
   s+= '';
   while (s.length < n) s+= ' ';
   return s;
}

function keydown(e){
   if (!e) e= event;
   keymesg('keydown ',e);
}

init();

// document.onkeydown = function(event){
//     var tKey = (event.which) ? event.which : event.keyCode;
//     if (tKey === 40) {
// 			console.log('pijl laag')
// 			document.body.style.background = 'red';
// 			// $('.answer').slick('slickPlay');
// 		}
//     if (tKey === 38) {
// 			console.log('pijl hoog')
// 			document.body.style.background = 'green';
//
// 			// $('.answer').slick('slickPause');
// 		}
// 		if (tKey === 32) {
// 			console.log('spatie')
// 			// var active = document.getElementsByClassName("slick-active")[0];
// 			// var currentfocus = document.activeElement;
// 			// var newActive = JSON.stringify(active);
// 			// var oldActive = JSON.stringify(currentfocus);
// 			//
// 			// if(document.activeElement == active){
// 			// 	console.log('focus')
// 			// 	active.blur();
// 			// } else {
// 			// 	console.log('geen focus')
// 			// 	active.focus();
// 			// }
// 		}
// }
