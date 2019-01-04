var video = document.querySelector('video');
var parent = document.querySelector('.overlay');
var section = document.querySelector('.overview');
var container = document.querySelector('.container-overview');

section.classList.add('video-playing');
video.addEventListener("timeupdate", myfunc, false);

function myfunc(){
	if(this.currentTime > this.duration-2){
		container.classList.add('fade-out')
		section.classList.remove('video-playing');
	}
}
