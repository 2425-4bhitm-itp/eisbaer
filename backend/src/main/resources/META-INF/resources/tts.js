let checkIfFirstTime = true;

const beginningText = document
     .getElementsByClassName("transcriptText")[0]
     .innerHTML;

console.log("textToBeSpoken: " + beginningText);

//Log all available voices
var voicelist = responsiveVoice.getVoices();
console.log(voicelist);

//Set voice
let voice = "Deutsch Male";
responsiveVoice.setDefaultVoice(voice);

// initialize text queue to ensure texts beeing spoken in right order
let textQueue = []
let isSpeaking = false;

function speak(text) {
    // Füge den Text zur Warteschlange hinzu
    textQueue.push(text);
    processQueue();
}

function processQueue() {
    // Wenn bereits gesprochen wird, warte
    if (isSpeaking) return;

    // Hole den nächsten Text aus der Warteschlange
    const nextText = textQueue.shift();
    if (!nextText) return; // Keine Texte mehr in der Warteschlange

    isSpeaking = true;
    responsiveVoice.speak(nextText, voice, {
        onend: () => {
            // Markiere, dass das Sprechen beendet wurde
            isSpeaking = false;
            // Verarbeite den nächsten Text
            processQueue();
        }
    });
}

document.body.addEventListener("click", function() {
     if(checkIfFirstTime) {
         speak(beginningText);
         checkIfFirstTime = false;
     }
});
