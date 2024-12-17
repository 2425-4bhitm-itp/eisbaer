let checkIfFirstTime = true;

const beginningText = document
    .getElementsByClassName("transcriptText")[0]
    .innerHTML;

console.log("textToBeSpoken: " + beginningText);

//Log all available voices
const voices = window.speechSynthesis.getVoices();
console.log(voices);

function speak(textToBeSpoken) {

    // Check if the browser supports the SpeechSynthesis API
    if (!window.speechSynthesis) {
        alert("Text-to-Speech wird von deinem Browser nicht unterstützt.");
        return;
    }

    // Create a new instance of SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(textToBeSpoken);

    // Set language to German
    utterance.lang = "de-DE";

    // Speaking speed and pitch (standard: 1)
    utterance.rate = 0.9;

    utterance.pitch = 0.5;

    // Set the voice
    utterance.voice = voices[0];

    // speak the text
    window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
    window.speechSynthesis.cancel();
}

document.body.addEventListener("click", function() {
    if(checkIfFirstTime) {
        speak(beginningText);
        checkIfFirstTime = false;
    }
});