/*
 *	Sets the url of the background.
 */
function setBackground() {
	let base64Image = localStorage.backgroundImage
	if(base64Image === undefined || base64Image === null) {
		console.debug(`No image saved locally. Will try again...`)
		setTimeout(setBackground, 100)
	} else {
		console.debug(`Image from localStorage loaded`)
		document.querySelector('body').style.backgroundImage = `url(${base64Image})`
	}

}
