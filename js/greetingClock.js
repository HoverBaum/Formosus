/**
 *   Displays a given greeting.
 *   @param  {string} greeting [description]
 */
function displayGreeting(greeting) {
    document.querySelector('#greeting-js').innerHTML = greeting;
}

/**
 *   Returns the appropriet greeting for the current hour.
 *   @param  {number} h [description]
 */
function calculateGreeting() {
    let h = new Date().getHours();
    let greetings = languages[config.language];
    if(greetings === undefined) {
        return 'Hello';
    }
	if(greetings.length === 0 && greetings.default === undefined) {
		return 'Hello';	//Standard english greeting if none present.
	}
	let greeting = greetings.default;
    greetings.forEach(greet => {
        if(greet.start <= h && greet.end > h) {
			greeting = greet.greeting;
		}
    });
	emit('greeting-changed', greeting);
}

/**
 *   Will display the current time.
 */
function displayTime() {
    let now = new Date();
    let hour = ('0' + now.getHours()).slice(-2);
    let minute = ('0' + now.getMinutes()).slice(-2);
	let time = hour + ':' + minute;
    document.querySelector('#time-js').innerHTML = time;
}
