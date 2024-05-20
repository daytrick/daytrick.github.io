const level = document.getElementById("recursionLevel");
const plaintext = document.getElementById("plaintext");
const encodeButton = document.getElementById("encode");
const ciphertext = document.getElementById("ciphertext");

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