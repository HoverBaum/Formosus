/**
 *   Simple publish and subscribe.
 */

var subscribers = new Map();

function subscribe(event, listener) {
    if(!subscribers.has(event)) {
        subscribers.set(event, []);
    }
    subscribers.get(event).push(listener);
}

function emit(event) {

    //Only publish if there are listeners.
    if(!subscribers.has(event)) {
        return;
    }

    //Call each listener with all supplied arguments.
    let listeners = subscribers.get(event);
    let allArgs = Array.prototype.slice.call(arguments, 1);
    listeners.forEach(listener => {
        listener(...allArgs);
    });
}
