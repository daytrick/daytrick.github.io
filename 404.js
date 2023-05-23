const MAX_COLS = 7;
const MAX_ROWS = 6;
const SVG_SIZE = 50;
const HOLE_SIZE = 20;
const SVG_NS = "http://www.w3.org/2000/svg";

var boardGrid = []
const PLAYER = "P";
const COMPUTER = "C";
var turn = PLAYER;
const COLOURS = {
    [PLAYER]: "rgb(239, 69, 114)",
    [COMPUTER]: "rgb(255, 230, 0)"
};
const NEIGHBOUR_SHIFTS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const PLAYER_COSTS = {
    3: 1000,
    2: 50,
    1: 5
};
const COMPUTER_COSTS = {
    3: 100000,
    2: 100,
    1: 10
};

//////////////////// LOADING ////////////////////

function load() {
    initBoard();
    loadBoard();
}

function initBoard() {
    boardGrid = [];
    
    for (let i = 0; i < MAX_COLS; i++) {
        let col = []
        for (let j = 0; j < MAX_ROWS; j++) {
            col.push(null);
        }
        boardGrid.push(col);
    }
}

/**
 * Load the viewable board.
 * 
 * Need to specify namespace for SVGs: https://stackoverflow.com/a/20539306
 */
function loadBoard() {

    let board = document.getElementById("board");

    // Add columns
    let colgroup = document.createElement("colgroup");
    for (let i = 0; i < MAX_COLS; i++) {
        let col = document.createElement("col");
        colgroup.appendChild(col);
    }
    board.appendChild(colgroup);

    // Add rows
    let tbody = document.createElement("tbody");
    for (let j = 0; j < MAX_ROWS; j++) {
        let tr = document.createElement("tr");
        for (let i = 0; i < MAX_COLS; i++) {
            let td = document.createElement("td");
            td.setAttribute("col", i);
            td.setAttribute("onclick", "userTurn(this)");

            // Show "empty" slot
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", SVG_SIZE);
            svg.setAttribute("height", SVG_SIZE);
            svg.appendChild(drawToken(svg, "mediumaquamarine"));
            td.appendChild(svg);

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    board.append(tbody);

}

function drawToken(svg, fill) {
    let circle = document.createElementNS(svg.namespaceURI, "circle");
    circle.setAttribute("cx", SVG_SIZE / 2);
    circle.setAttribute("cy", SVG_SIZE / 2);
    circle.setAttribute("r", HOLE_SIZE);
    circle.setAttribute("stroke-width", 0);
    circle.setAttribute("fill", fill);
    return circle;
}


//////////////////// PLAYING ////////////////////

function isOnBoard(col, row) {

    return ((0 <= col) && (col < MAX_COLS) && (0 <= row) && (row < MAX_ROWS));

}


function userTurn(td) {

    if (turn == PLAYER) {

        let col = td.getAttribute("col");
        let tbody = document.getElementsByClassName("tbody")[0];

        // Figure out where the user wanted to put their counter
        let row = getFirstEmptySpace(col);

        // Make move
        putTokenIn(col, row, PLAYER);

        // Call computer's go
        if (isWinningMove(col, row)) {
            alert("You won!");
        }
        else {
            computerTurn();
        }

    }
    else {
        alert("It's not your turn!");
    }

}

function getFirstEmptySpace(col) {

    for (let i = MAX_ROWS - 1; i >= 0; i--) {
        if (boardGrid[col][i] == null) {
            return i;
        }
    }

    return false;

}

function isWinningMove(c, r) {

    // Check all neighbouring holes...
    for ([x, y] of NEIGHBOUR_SHIFTS) {

        let col = c + y;
        if ((0 > col) || (col >= MAX_COLS)) {
            continue;
        }
        let row = r + x;
        if ((0 > row) || (row >= MAX_ROWS)) {
            continue;
        }
    
        if (checkLine(c, r, y, x, PLAYER) == 3) {
            return true;
        }

    }

    return false;

}

function putTokenIn(col, row, user) {

    // Logical model
    boardGrid[col][row] = user;

    // Viewable board
    let tbody = document.getElementsByTagName("tbody")[0];
    let rows = tbody.getElementsByTagName("tr");
    let hole = Array.from(rows[row].getElementsByTagName("td")).filter((td) => td.getAttribute("col") == col)[0];
    let circle = hole.getElementsByTagName("circle")[0];
    circle.setAttribute("fill", COLOURS[user]);

}


/**
 * Computer makes a move by:
 * - immediately making its winning move, or
 * - blocking immediately if player will win somewhere, or
 * - finding slot where it will connect the most of its counters
 */
function computerTurn() {

    turn = COMPUTER;

    let scores = [];
    let won = false;

    // Figure out likelihood of winning for each column
    for (let c = 0; c < MAX_COLS; c++) {

        let r = getFirstEmptySpace(c);
        if (r == false) {
            scores.push(-1);
        }
        else {
            
            let score = 0;

            // Check all neighbouring holes...
            for ([x, y] of NEIGHBOUR_SHIFTS) {

                let col = c + y;
                if ((0 > col) || (col >= MAX_COLS)) {
                    continue;
                }
                let row = r + x;
                if ((0 > row) || (row >= MAX_ROWS)) {
                    continue;
                }
                
                if (boardGrid[col][row] == PLAYER) {
                    let connection = checkLine(c, r, y, x, PLAYER);
                    score += PLAYER_COSTS[connection];
                }
                else if (boardGrid[col][row] == COMPUTER) {
                    let connection = checkLine(c, r, y, x, COMPUTER);
                    score += COMPUTER_COSTS[connection];
                    if (connection == 3) {
                        won = true;
                        break;
                    }
                }
                // ignore if blank

            }

            scores.push(score);

        }

    }

    // Find the most likely column
    let max = Math.max(...scores);
    let c = scores.indexOf(max);
    let r = getFirstEmptySpace(c);

    // Pause before making move so it seems like the computer is thinking
    setTimeout(() => {
        putTokenIn(c, r, COMPUTER);
        if (won) {
            alert("You lose!");
        }
        else {
            turn = PLAYER;
        }
    }, 500);

}

function checkLine(c, r, y, x, counter) {

    let connection = 0;
    for (let i = 0; i < 3; i++) {

        c += y;
        r += x;

        if (isOnBoard(c, r) && boardGrid[c][r] == counter) {
            connection += 1;
        }
        else {
            break;
        }

    }

    return connection;
}