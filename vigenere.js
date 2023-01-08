/**
 * Checks whether a character is in the alphabet.
 * 
 * Based on: https://stackoverflow.com/a/40120933
 */
function isUpperAlpha(ch) {
    return /^[A-Z]$/.test(ch);
}

function isLowerAlpha(ch) {
    return /^[a-z]$/.test(ch);
}

function printMap(map) {
    for (const [key, value] of map) {
        console.log(key + ": " + value);
    }
}

//////////////////// ENCRYPTION/DECRYPTION ////////////////////
const ENCRYPT = 1
const DECRYPT = -1

function crypt(key, ciphertext, direction) {

    //console.log("Key: " + key)
    //console.log("Ciphertext: " + ciphertext)

    let plaintext = ""
    let j = 0

    for (let i = 0; i < ciphertext.length; i++) {
        const c = ciphertext[i]

        if (isUpperAlpha(c)) {
            let shift = (key.toUpperCase().charCodeAt(j) - "A".charCodeAt(0) + 1) * direction
            j = (j + 1) % key.length

            let encryptedC = ((c.charCodeAt(0) + shift - "A".charCodeAt(0) + 26) % 26) + "A".charCodeAt(0)
            plaintext += String.fromCharCode(encryptedC)
        }
        else if (isLowerAlpha(c)) {
            let shift = (key.toLowerCase().charCodeAt(j) - "a".charCodeAt(0) + 1) * direction
            j = (j + 1) % key.length
            
            let encryptedC = ((c.charCodeAt(0) + shift - "a".charCodeAt(0) + 26) % 26) + "a".charCodeAt(0)
            plaintext += String.fromCharCode(encryptedC)
        }
        else {
            plaintext += c
        }

        //console.log("Plaintext: '" + plaintext + "'")

    }

    //console.log("Plaintext: '" + plaintext + "'")
    return plaintext

}

function writeCiphertext() {

    key = document.getElementById("keyGiven").value;
    plaintext = document.getElementById("plaintext").value;

    ciphertext = crypt(key, plaintext, ENCRYPT);

    ciphertextBox = document.getElementById("ciphertext");
    ciphertextBox.value = ciphertext;

}

function writePlaintext() {

    let key = document.getElementById("keyCracked").value;
    let ciphertext = document.getElementById("ciphertext").value;
    let plaintextBox = document.getElementById("plaintext");

    if (strip(key) != "") {
        plaintextBox.value = crypt(key, ciphertext, DECRYPT);
    }
    else {
        plaintextBox.value = analyse();
    }

}



//////////////////// CRYPTANALYSIS ////////////////////

/**
 * How to find max key-value pair from: https://stackoverflow.com/a/51690218
 */
function max(map) {
    return [...map.entries()].reduce((a, e) => e[1] > a[1] ? e : a);
}

function strip(ciphertext) {

    ciphertext = ciphertext.toLowerCase();
    newCiphertext = ""

    for (var i = 0; i < ciphertext.length; i++) {
        const c = ciphertext[i];

        if (isLowerAlpha(c)) {
            newCiphertext += c;
        }

    }

    return newCiphertext;
}

function initLetterFreqs() {

    let counts = new Map();
    for (var i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
        c = String.fromCharCode(i);
        counts.set(c, 0);
    }

    return counts;

}

function calcIndexOfCoincidence(text) {

    text = strip(text);
    n = text.length;

    // Set frequencies up
    counts = initLetterFreqs();

    // Count frequencies
    for (const c of text) {
        counts.set(c, counts.get(c) + 1);
    }

    // Print frequencies
    /*console.log("Counts: ");
    for (const [key, value] of counts.entries()) {
        console.log(key + ": " + value);
    }*/

    // Actually calculate the IC
    return Array.from(counts.values()).reduce((partialSum, v) => partialSum + (v * (v - 1))) / (n * (n - 1));

}

function calcICForPeriod(text, period) {

    // Calc individual ICs
    let ics = [];

    for (var i = 0; i < period; i++) {

        // Create subset
        subset = "";
        for (var j = i; j < text.length; j += period) {
            subset += text[j];
        }
        console.log("Subset for period " + i + ": " + subset);

        ics.push(calcIndexOfCoincidence(subset));

    }

    console.log("IC for " + period + ": " + (ics.reduce((partialSum, ic) => partialSum + ic) / period));

    // Average them
    return ics.reduce((partialSum, ic) => partialSum + ic) / period;

}

function findPeriod(text, lowerBound, upperBound) {

    // Strip spaces and punctuation
    text = strip(text);

    // Calculate ICs for each possible period
    ics = new Map();
    for (var i = lowerBound; i <= upperBound; i++) {
        ics.set(i, calcICForPeriod(text, i));
    }

    // Print ICs
    for (const [key, value] of ics.entries()) {
        console.log("IC for " + key + ": " + value);
    }

    // Find max IC
    maxIC = max(ics)
    console.log("Max: " + maxIC);

    // Return the period
    return maxIC[0];
    
}

function doLFA(ciphertext) {

    // Count frequencies
    let counts = initLetterFreqs();
    for (const c of ciphertext) {
        counts.set(c, counts.get(c) + 1);
    }

    // Find letter with max freq
    mostCommon = max(counts);

    // Work out shift
    shift = (mostCommon[0].charCodeAt(0) - "e".charCodeAt(0) + 26) % 26;
    console.log("Shift: " + shift);
    
    // Calculate map
    let map = new Map();

    for (var i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
        map.set(applyShift(i, shift, "a"), String.fromCharCode(i));
    }
    for (var i = "A".charCodeAt(0); i <= "Z".charCodeAt(0); i++) {
        map.set(applyShift(i, shift, "A"), String.fromCharCode(i));
    }

    printMap(map);

    return map;

}

function applyShift(base, shift, a) {

    let shifted = String.fromCharCode(((base + shift - a.charCodeAt(0)) % 26) + a.charCodeAt(0));

    if (!isLowerAlpha(shifted) && !isUpperAlpha(shifted)) {
        alert("Shifted incorrectly: " + base + " shifted by " + shift);
    }

    return shifted;

}

function mapCipherToPlain(ciphertext, period, maps) {

    let plaintext = "";
    let i = 0;

    for (const c of ciphertext) {
        if (isLowerAlpha(c) || isUpperAlpha(c)) {
            plaintext += maps[i % period].get(c);
            i += 1;
        }
        else {
            plaintext += c;
        }
    }

    console.log("Plaintext: " + plaintext);
    return plaintext;

}

function analyse() {

    let ciphertext = document.getElementById("ciphertext").value;
    let lowerBound = document.getElementById("lowerBound").value;
    let upperBound = document.getElementById("upperBound").value;

    // Find key length
    let period = findPeriod(ciphertext, Number(lowerBound), Number(upperBound));
    console.log("Period: " + period);

    // Do LFA for each ciphertext subset
    let maps = []
    for (var i = 0; i < period; i++) {

        // Create subset
        subset = "";
        for (var j = i; j < ciphertext.length; j += period) {
            subset += ciphertext[j];
        }
        console.log("Subset for period " + i + ": " + subset);

        maps.push(doLFA(subset.toLowerCase()));

    }

    // Use maps to get and return plaintext
    return mapCipherToPlain(ciphertext, period, maps);

}