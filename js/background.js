/*
 *	Sets the url of the background.
 */
function setBackground() {
	let base64Image = localStorage.backgroundImage;
	if(base64Image === undefined || base64Image === null) {
		setTimeout(setBackground, 100);
	} else {
		document.querySelector('body').style.backgroundImage = `url(${base64Image})`;
	}

}
