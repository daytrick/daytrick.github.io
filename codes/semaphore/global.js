var canvas = document.getElementById("ciphertext");
var ctx = canvas.getContext("2d");
const canvasHeight = 300;
const canvasWidth = 500;

var r = 25;
var rAngled = (r / Math.sqrt(2));
var lines = [[0, r], [-rAngled, rAngled], [-r, 0], [-rAngled, -rAngled], [0, -r], [rAngled, -rAngled], [r, 0], [rAngled, rAngled]];
var mappings = {
    "a": [5, 0],
    "b": [6, 0],
    "c": [7, 0],
    "d": [0, 0],
    "e": [1, 0],
    "f": [2, 0],
    "g": [3, 0],
    "h": [6, 1],
    "i": [7, 1],
    "j": [0, 6],
    "k": [0, 1],
    "l": [1, 1],
    "m": [2, 1],
    "n": [5, 7],
    "o": [7, 2],
    "p": [0, 2],
    "q": [1, 2],
    "r": [6, 6],
    "s": [6, 7],
    "t": [0, 3],
    "u": [7, 5],
    "v": [0, 7],
    "w": [1, 6],
    "x": [1, 7],
    "y": [7, 6],
    "z": [2, 7]
};

var plaintextLetters = [];



/**
 * Round a number to a certain number of decimal places.
 * 
 * Copied from: https://stackoverflow.com/a/67865037
 * 
 * @param {Number} number 
 * @param {Number} dp 
 * @returns rounded number
 */
function round(number, dp=3) {

    const h = +('1'.padEnd(dp + 1, '0')) // 10 or 100 or 1000 or etc
    return Math.round(number * h) / h;

}