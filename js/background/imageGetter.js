function updateSavedBackground() {
	const today = new Date().getDate();
	const lastUpdate = localStorage.lastUpdate;
	if(lastUpdate === null || lastUpdate === undefined || lastUpdate !== today) {
		const width = screen.width;
		const height = screen.height;
		downloadImage(width, height);
	}
}

function downloadImage(width, height) {
	const url = `https://source.unsplash.com/category/nature/${width}x${height}/daily`;
	urlToBase64(url, function(base64) {
		localStorage.backgroundImage = base64;
		localStorage.lastUpdate = new Date().getDate();
	});
}


urlToBase64 = function(path, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
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
