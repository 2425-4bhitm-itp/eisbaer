// Get a reference to the div you want to auto-scroll.
var transcriptContainer = document.querySelector('#transcriptContainer');

var windowHeight = window.innerHeight;
var windowWidth = window.innerWidth;

// First, define a helper function.
function animateScroll(duration) {

    var start = transcriptContainer.scrollTop;
    var end = transcriptContainer.scrollHeight - transcriptContainer.clientHeight;
    var change = end - start;
    var increment = 20;

    //if window is in portrait mode, div will scroll to top
    // if (windowHeight >= windowWidth) { todo: implement reverse scroll
    //     change = start - end;
    // }

    function easeInOut(currentTime, start, change, duration) {
        // by Robert Penner
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return change / 2 * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    }
    function animate(elapsedTime) {
        elapsedTime += increment;
        var position = easeInOut(elapsedTime, start, change, duration);
        transcriptContainer.scrollTop = position;
        if (elapsedTime < duration) {
            setTimeout(function() {
                animate(elapsedTime);
            }, increment)
        }
    }
    animate(0);
}
// Here's our main callback function we passed to the observer
function chatScroll() {
    var duration = 300 // Or however many milliseconds you want to scroll to last
    animateScroll(duration);
}