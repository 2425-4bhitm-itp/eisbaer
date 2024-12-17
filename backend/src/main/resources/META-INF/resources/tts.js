let checkIfFirstTime = true;

const beginningText = document
    .getElementsByClassName("transcriptText")[0]
    .innerHTML;

console.log("textToBeSpoken: " + beginningText);

function speak(textToBeSpoken) {

    if (!window.speechSynthesis) {
        alert("Text-to-Speech wird von deinem Browser nicht unterstützt.");
        return;
    }

    // Neue SpeechSynthesisUtterance erstellen
    const utterance = new SpeechSynthesisUtterance(textToBeSpoken);

    // Stimme und Sprache festlegen (z. B. Deutsch)
    utterance.lang = "de-DE";

    // Sprechgeschwindigkeit (1.0 ist Standard)
    utterance.rate = 0.9;

    utterance.pitch = 0.5;

    // Text sprechen
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