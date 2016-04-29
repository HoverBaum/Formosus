/*
	Checks the current background image and updates it if need be.
*/
function setBackground() {
	$('body').css('background-image', 'url('+ images[imageIndex].src +')');
}

/*
	Displays the next image according to the index.
*/
function displayNextImage() {
	var today = new Date().getDay();
	if(lastInc !== null) {
		//Check for index here, so we can set it below if need be.
		if(lastInc == today && imageIndex !== null) {
			return;
		}
	}
	if(imageIndex === null) {
		imageIndex = Math.ceil(Math.random() * images.length) - 1;
	}
	imageIndex++;
	if(imageIndex >= images.length) imageIndex = 0;
	updateBackground();
	lastInc = today;
	localStorage.setItem('imageIndex', imageIndex);
	localStorage.setItem('lastInc', lastInc);
}
