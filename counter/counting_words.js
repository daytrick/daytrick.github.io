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
    IA: {
        name: "Internal Assessment",
        words: 2000,
        desc: "The word limit for an IB IA."
    },
    EE: {
        name: "Extended Essay",
        words: 2000,
        desc: "The word limit for an IB EE."
    }
}

//////////////////// DISPLAYING UNITS ////////////////////

function onload() {

    // Display all the starting units
    let abbDiv = document.getElementById("abbDiv");
    let countDiv = document.getElementById("countDiv");

    for (const abb in units) {

        let unitP = document.createElement("p");
        unitP.innerHTML = abb + ": ";
        abbDiv.appendChild(unitP);

        let count = document.createElement("p");
        count.id = abb;
        countDiv.appendChild(count);

    }

    console.log("Loaded initial units!");
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