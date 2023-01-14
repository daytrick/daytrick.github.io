const SIG_FIGS = 8;

var units = {
    ME: { 
        name: "McEwan",
        words: 42,
        desc: "The average number of words in one of Ian McEwan's sentences from his book 'Enduring Love'. (Non-representative, and based on hazy memories of a distracted English class.)"
    },
    CSR: {
        name: "Computer Science Report",
        words: 700,
        desc: "The usual target word count for one of my computer science reports."
    },
    EE: {
        name: "Extended Essay",
        words: 2000,
        desc: "The word limit for an IB EE."
    }
}

//////////////////// DISPLAY ////////////////////

function onload() {

    displayStartingUnits();

}

function displayStartingUnits() {

    for (const abb in units) {
        displayUnit(abb);
    }

    console.log("Loaded initial units!");

}

function displayUnit(symbol) {

    let abbDiv = document.getElementById("abbDiv");
    let countDiv = document.getElementById("countDiv");

    let unitP = document.createElement("p");
    unitP.innerHTML = symbol + ": ";
    unitP.title = units[symbol].desc;
    abbDiv.appendChild(unitP);

    let count = document.createElement("p");
    count.id = symbol;
    countDiv.appendChild(count);

}

function showCreateDiv() {

    let createDiv = document.getElementById("createDiv");
    createDiv.hidden = false;

    let buttonDiv = document.getElementById("buttonDiv");
    buttonDiv.hidden = true;

}

//////////////////// COUNTING ////////////////////

function calcCounts() {

    let wordCount = countWords();

    // Update straight word count
    let words = document.getElementById("words");
    words.innerHTML = wordCount;

    // Update other counts
    let others = document.getElementById("countDiv").childNodes;
    console.log("Child nodes: " + others);

    others.forEach((child) => {
        child.innerHTML = +(wordCount / units[child.id].words).toPrecision(SIG_FIGS);
    });

}

function countWords() {

    // Get text from the textarea
    let text = document.getElementById("text").value;

    // Get next token and count it if it's a word
    let tokenizer = tokenize(text);
    let count = 0;

    while ((nextToken = tokenizer.next().value) != undefined) {

        if (isWord(nextToken)) {
            count++;
        }

    }

    return count;

}

/**
 * Decides whether a token is a word.
 * 
 * Following Microsoft Word rules
 * (words are alphanumeric,
 *  a hyphenated token counts as one word,
 *  digit-only numbers count as words)
 * except for an all-punctuation token counting as a word bc that's just annoying.
 * 
 * @param {String} token 
 */
function isWord(token) {

    return token.match(/[\w]*/);

}

/**
 * Splits text into tokens based on where whitespace and punctuation are.
 * Hyphenated things count as one token.
 * 
 * @param {String} text 
 */
function* tokenize(text) {

    console.log("Text: " + text);

    let currentToken = "";

    for (const c of text) {

        if (/\p{P}|\p{S}|[ ]/gu.test(c) && (c != '-')) {
            yield currentToken;
            currentToken = "";
        }
        else {
            currentToken += c;
        }

    }

    if (currentToken != "") {
        yield currentToken;
    }

}

//////////////////// NEW UNITS ////////////////////
function addUnit() {

    // Only add unit if name and symbol are unique
    if (verifyAttributes()) {

        let createDiv = document.getElementById("createDiv");
        let buttonDiv = document.getElementById("buttonDiv");
        let nameBox = document.getElementById("nameBox");
        let symBox = document.getElementById("symBox");
        let countBox = document.getElementById("countBox");
        let descBox = document.getElementById("descBox");

        // Add units
        units[symBox.value] = {
            name: nameBox.value,
            words: countBox.value,
            desc: descBox.value
        }

        // Update display
        displayUnit(symBox.value);

        // Clear contents of this div and hide it
        nameBox.value = "";
        symBox.value = "";
        countBox.value = "";
        descBox.value = "";
        console.log("Inputs cleared!")

        createDiv.hidden = true;
        buttonDiv.hidden = false;

    }

}

function verifyAttributes() {

    // Symbol
    let symbol = document.getElementById("symBox").value;
    if (units[symbol] != undefined) {
        alert("This symbol is already in use!");
        return false;
    }

    // Name
    let name = document.getElementById("nameBox").value;
    let found = Object.keys(units).reduce((prev, current) => prev || (units[current].name.toLowerCase() == name.toLowerCase()), false);
    if (found) {
        alert("This name is already in use!");
        return false;
    }

    // Count
    let count = document.getElementById("countBox").value;
    if (!(count > 0) || (count != (count / 1))) {
        alert("Invalid number of words per unit!");
        return false;
    }

    return true;

}