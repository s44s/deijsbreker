document.body.onkeyup = function(event){
    var tKey = (event.which) ? event.which : event.keyCode;
    if (tKey === 40) {
			console.log('pijl laag')
			document.querySelector('select').focus();
		}
    if (tKey === 38) {
			console.log('pijl hoog')
		}
		if (tKey === 32) {
			console.log('spatie')
			var active = document.getElementsByClassName("slick-active")[0];
			var currentfocus = document.activeElement;
			var newActive = JSON.stringify(active);
			var oldActive = JSON.stringify(currentfocus);

			console.log(newActive == oldActive)

			if(document.activeElement == active){
				console.log('focus')
				active.blur();
			} else {
				console.log('geen focus')
				active.focus();
			}		}
		if (tKey === 39) {
		}
}
