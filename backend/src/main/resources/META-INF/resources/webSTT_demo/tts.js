function speak() {
    const text = document.getElementById("text").value;

    if (!window.speechSynthesis) {
        alert("Text-to-Speech wird von deinem Browser nicht unterstützt.");
        return;
    }

    // Neue SpeechSynthesisUtterance erstellen
    const utterance = new SpeechSynthesisUtterance(text);

    // Stimme und Sprache festlegen (z. B. Deutsch)
    utterance.lang = "de-DE";

    // Sprechgeschwindigkeit (1.0 ist Standard)
    utterance.rate = 0.5;

    utterance.pitch = 0.5;

    // Text sprechen
    window.speechSynthesis.speak(utterance);
}

// Sprechvorgang stoppen
function stopSpeech() {
    window.speechSynthesis.cancel();
}