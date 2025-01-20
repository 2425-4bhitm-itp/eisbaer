let img = Document.getElementById("2dAvatar");

var loop= setInterval(switchAvatar,100);

function switchAvatar() {
    if (isSpeaking) {
        img.src = "images/2dAvatarSpeaking.gif";
    } else {
        img.src = "https://www.w3schools.com/js/pic_bulbon.gif";
    }
}