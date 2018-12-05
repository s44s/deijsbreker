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
			if (autoplay == true){
				$('.answer').slick('slickSetOption', 'autoplay', 'false');
				$('.answer').slick('slickPause');
			} else {
				$('.answer').slick('slickSetOption', 'autoplay', 'true');
				$('.answer').slick('slickPlay');
			}
		}
		if(keyval(e.keyCode).substr(0,2) == 87){ //w
		}
		if(keyval(e.keyCode).substr(0,2) == 65){ //a
		}
		if(keyval(e.keyCode).substr(0,2) == 83){ //s
		}
		if(keyval(e.keyCode).substr(0,2) == 68){ //d
		}
		if(keyval(e.keyCode).substr(0,2) == 70){ //f
		}
		if(keyval(e.keyCode).substr(0,2) == 71){ //g
		}
		if(keyval(e.keyCode).substr(0,2) == 0){ //pijl omlaag
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
