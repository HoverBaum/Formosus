/*
 *	Sets the url of the background.
 */
function setBackground() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let url = `https://source.unsplash.com/category/nature/${width}x${height}/daily`;
    document.querySelector('#background').src = url;
}
