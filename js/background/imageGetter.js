/**
 *   Will update the saved background image.
 *   Only once a day though as we use the /daily image from unsplash.
 *   This makes sure to only run the request once a day to reduce requests.
 */
function updateSavedBackground() {
	const today = new Date().getDate();
	const lastUpdate = localStorage.lastUpdate;
	if(lastUpdate === null || lastUpdate === undefined || lastUpdate !== today) {
		const width = screen.width;
		const height = screen.height;
		downloadImage(width, height);
	}
}

/**
 *   Actually download and save an image.
 *   @param  {Number} width  - How wide the image hsould be.
 *   @param  {Number} height - How high the image should be.
 */
function downloadImage(width, height) {
	const url = `https://source.unsplash.com/category/nature/${width}x${height}/daily`;
	urlToBase64(url, function(base64) {
		localStorage.backgroundImage = base64;
		localStorage.lastUpdate = new Date().getDate();
	});
}

/**
 *   Get an image from a url and return it base64 encoded.
 *   @param  {String}   url      - Url leading to the image that should be converted.
 *   @param  {Function} callback - Function to be called with base64 encoded image.
 */
urlToBase64 = function(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
        if (this.status == 200) {
            const blob = this.response;
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function() {
                base64data = reader.result;
                callback(base64data);
            }
        }
    };
    xhr.send();
};
