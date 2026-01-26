let checkIfFirstTime: boolean = true;
declare const responsiveVoice: any;

const beginningText: string = "Hallo, ich bin Eisbär! Wie kann ich dir helfen?"// document todo
     // .getElementsByClassName("transcriptText")[0]
     // .innerHTML;

console.log("textToBeSpoken: " + beginningText);

var voicelist = responsiveVoice.getVoices();
console.log(voicelist);

let voice = "Deutsch Male";
responsiveVoice.setDefaultVoice(voice);

// initialize text queue to ensure texts beeing spoken in right order
let textQueue: string[] = []
let isSpeaking = false;

function speak(text: string) {
    // Füge den Text zur Warteschlange hinzu
    textQueue.push(text);
    processQueue();
}

function processQueue() {
    // Wenn bereits gesprochen wird, warte
    if (isSpeaking) return;

    // Hole den nächsten Text aus der Warteschlange
    const nextText = textQueue.shift();
    if (!nextText) {
        return;
    } // Keine Texte mehr in der Warteschlange

    isSpeaking = true;
    changeToSpeakAvatar();
    console.log("Sprechen beginnt");

    responsiveVoice.speak(nextText, voice, {
        onend: () => {
            // Markiere, dass das Sprechen beendet wurde
            isSpeaking = false;
            changeToDefaultAvatar();
            console.log("Sprechen beendet");
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

const img: HTMLImageElement = <HTMLImageElement>document.getElementById("2dAvatar");

function changeToSpeakAvatar() {
    console.log("changeToSpeakAvatar");
    img.src = "./video/eisbar_talking.gif";
}

function changeToDefaultAvatar() {
    console.log("changeToDefaultAvatar");
    img.src = "./video/polar-bear-no-background-png.png";
}

export { speak }
