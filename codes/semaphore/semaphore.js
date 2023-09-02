var canvas = document.getElementById("ciphertext");
var ctx = canvas.getContext("2d");
const canvasHeight = 300;
const canvasWidth = 500;

var r = 25;
var rAngled = (r / Math.sqrt(2));
var lines = [[0, r], [-rAngled, rAngled], [-r, 0], [-rAngled, -rAngled], [0, -r], [rAngled, -rAngled], [r, 0], [rAngled, rAngled]];
var mappings = {
    "a": [1, 0],
    "b": [2, 0],
    "c": [3, 0],
    "d": [4, 0],
    "e": [5, 0],
    "f": [6, 0],
    "g": [0, 7],
    "h": [2, 1],
    "i": [3, 1],
    "j": [4, 6],
    "k": [4, 1],
    "l": [5, 1],
    "m": [1, 6],
    "n": [1, 7],
    "o": [3, 2],
    "p": [4, 2],
    "q": [2, 5],
    "r": [2, 6],
    "s": [2, 7],
    "t": [4, 3],
    "u": [3, 5],
    "v": [4, 7],
    "w": [5, 6],
    "x": [5, 7],
    "y": [3, 6],
    "z": [6, 7]
};
var lowest = 50;
var rightmost = 50;
var justDrewLetter = false;

function onload() {
    background(255, 255, 255);
}

/*function drawLetter(letter) {

    if (justDrewLetter) {
        drawJoin();
    }

    let stroke1 = lines[mappings[letter][0]];
    let stroke2 = lines[mappings[letter][1]];

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);

    let nextPoint = [lastPoint.x - stroke1[0], lastPoint.y - stroke1[1]];
    ctx.lineTo(nextPoint[0], nextPoint[1]);
    lowest = Math.max(nextPoint[1], lowest);
    rightmost = Math.max(nextPoint[0], rightmost);

    nextPoint = [nextPoint[0] + stroke2[0], nextPoint[1] + stroke2[1]];
    ctx.lineTo(nextPoint[0], nextPoint[1]);
    lowest = Math.max(nextPoint[1], lowest);
    rightmost = Math.max(nextPoint[0], rightmost);

    ctx.stroke();
    lastPoint = nextPoint;
    
}*/


function generateLetterOrientations(plaintext) {

    let currLetter = new Letter(plaintext[i]);
    currLetter.prev = null;

    for (const letter of plaintext) {
        
        
        addLetter(currLetter);
    }
    

}


function drawJoin() {
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 3, 0, 2 * Math.PI);
    ctx.fill();
}

onkeydown = function(event) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lastPoint = new Point(50, 50);
    lowest = 50;
    rightmost = 50;

    if (event.key === "Enter") {
        plaintext = document.getElementById("plaintext").value;

        let plaintext = plaintext.toLowerCase();
        for (let i = 0; i < plaintext.length; i++) {

            let char = plaintext[i];

            if (/[A-Za-z]/.test(char)) {
                drawLetter(plaintext, i);
                justDrewLetter = true;
            }
            else if (char == " ") {
                if ((lowest + 50) > canvasHeight) {
                    lowest = 50;
                    rightmost += 50;
                    lastPoint = new Point(rightmost, lowest);
                }
                else {
                    lowest += 50;
                    lastPoint = new Point(rightmost, lowest);
                }
                justDrewLetter = false;
            }
            else if (char = "\n") {
                lowest = 50;
                rightmost += 50;
                lastPoint = new Point(rightmost, lowest);
                justDrewLetter = false;
            }

        };
    }
    
}