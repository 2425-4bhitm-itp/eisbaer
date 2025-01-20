const img = document.getElementById("2dAvatar");

var loop= setInterval(switchAvatar,100);
var started = true;

console.log("loopstart ");

function switchAvatar() {
    if (isSpeaking && !started) {
        started = true;
        img.src = "./video/seamless-loop-talking-unscreen.gif";
    }

    if (!isSpeaking) {
        started = false;
        img.src = "https://www.w3schools.com/js/pic_bulbon.gif";
    }
    console.log("isSpeaking: " + isSpeaking);
}