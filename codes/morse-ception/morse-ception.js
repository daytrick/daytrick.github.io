const level = document.getElementById("recursionLevel");
const plaintext = document.getElementById("plaintext");
const encodeButton = document.getElementById("encode");
const ciphertext = document.getElementById("ciphertext");

const FREQ = 550;
const WAVE = "square";
const UNIT_MS = 100;
const UNIT_S = UNIT_MS / 1000;

function onChangeEncode() {

    if (!level.value.match(/[0-9]+/)) {
        alert("The recursion level needs to be a number.");
        encodeButton.className = "notOK";
    }
    else if (plaintext.value.trim() != "") {
        encodeButton.className = "ok";
    }
    else {
        encodeButton.className = "notOK";
    }

}



function writeMorse() {

    let text = plaintext.value;
    let lastLevel = level.value;

    for (let i = 0; i < lastLevel; i++) {
        text = encode(text);
    }

    ciphertext.value = text;

    console.log("Wrote the Morse code!");

}



function encode(text) {

    let newText = "";

    for (char of text) {
        char = char.toLowerCase();
        console.log(char);

        if (char in dict) {
            newText += dict[char];
            newText += " ";
        }

    }

    return newText.trim();

}



function play() {

    let text = ciphertext.value;
    console.log("Playing!");
    playNext(text, 0);
    console.log("Text length: " + text.length);

}

function playNext(text, i) {

    if (i >= text.length) {
        return;
    }

    
    let char = text[i];

    if (char === ".") {
        playTone(FREQ, WAVE, UNIT_S);
        console.log(".");
        setTimeout(() => {
            playNext(text, i+1);
        }, UNIT_MS * 2);
    }
    else if (char === "-") {
        playTone(FREQ, WAVE, UNIT_S * 3);
        console.log("-");
        setTimeout(() => {
            playNext(text, i+1);
        }, UNIT_MS * 4);
    }
    else {
        console.log(" ");
        setTimeout(() => {
            playNext(text, i+1);
        }, UNIT_MS * 6);
    }

}