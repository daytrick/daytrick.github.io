const MAX_COLS = 7;
const MAX_ROWS = 6;
const SVG_SIZE = 50;
const HOLE_SIZE = 20;
const SVG_NS = "http://www.w3.org/2000/svg";

var boardGrid = []
const PLAYER = "P";
const COMPUTER = "C";
const OVER = "O"
var turn = PLAYER;
var firstTurn = true;
const COLOURS = {
    [PLAYER]: "rgb(239, 69, 114)",
    [COMPUTER]: "rgb(255, 230, 0)"
};
const NEIGHBOUR_SHIFTS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const PLAYER_COSTS = {
    4: 100000, // won't ever be used, here for symmetry's sake
    3: 1000,
    2: 50,
    1: 5
};
const COMPUTER_COSTS = {
    4: 100000,
    3: 100000,
    2: 100,
    1: 10
};

//////////////////// LOADING ////////////////////

/**
 * Load dynamic elements after HTML is done loading.
 */
function load() {
    initBoard();
    loadBoard();
}

/**
 * Initialize the board array to all Os.
 */
function initBoard() {
    boardGrid = [];
    
    for (let i = 0; i < MAX_COLS; i++) {
        let col = []
        for (let j = 0; j < MAX_ROWS; j++) {
            col.push("O");
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

/**
 * Draws a token into the provided hole.
 * 
 * @param {HTMLElement} svg     the svg to be redrawn
 * @param {String} fill         the colour of the token
 * @returns 
 */
function drawToken(svg, fill) {
    let circle = document.createElementNS(svg.namespaceURI, "circle");
    circle.setAttribute("cx", SVG_SIZE / 2);
    circle.setAttribute("cy", SVG_SIZE / 2);
    circle.setAttribute("r", HOLE_SIZE);
    circle.setAttribute("stroke-width", 0);
    circle.setAttribute("fill", fill);
    return circle;
}



/**
 * Reset the board to play again.
 */
function resetBoard() {

    // Reset logical board
    initBoard();

    // Reset visual board
    let circles = document.getElementsByTagNameNS(SVG_NS, "circle");
    Array.from(circles).forEach((circle) => circle.setAttribute("fill", "mediumaquamarine"));

    // Reset turns
    turn = PLAYER;
    firstTurn = true;

    // Hide button
    let button = document.getElementById("again");
    button.style.display = "none";

}


//////////////////// PLAYING ////////////////////

/**
 * Check if a hole actually exists on the board.
 * 
 * @param {Integer} col 
 * @param {Integer} row 
 * @returns 
 */
function isOnBoard(col, row) {

    return ((0 <= col) && (col < MAX_COLS) && (0 <= row) && (row < MAX_ROWS));

}



/**
 * Allows the user to make a move, 
 * then gets the computer to make a move.
 * 
 * @param {HTMLElement} td the table cell that was clicked on
 */
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
            showEndgameMessage("You won!");
        }
        else {
            computerTurn();
        }

    }
    else {
        showMessage("It's not your turn!");
    }

}


/**
 * Gets the first empty space in a column
 * (like where the token would go if gravity was a thing online).
 * 
 * @param {Integer} col 
 * @returns 
 */
function getFirstEmptySpace(col) {

    if ((0 <= col) && (col < MAX_COLS)) {
        for (let i = MAX_ROWS - 1; i >= 0; i--) {
            if (boardGrid[col][i] == "O") {
                return i;
            }
        }
    }

    return false;

}



/**
 * Put a token into the board.
 * 
 * @param {*} col   the column to place it in
 * @param {*} row   the row it will end up in
 * @param {*} user  who's making the move
 */
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
    let c = 0;

    if (firstTurn) {
        c = makeRandomMove();
        firstTurn = false;
    }
    else {
        c = makeBestMove();
    }

    let r = getFirstEmptySpace(c);


    // Pause before making move so it seems like the computer is thinking
    setTimeout(() => {
        putTokenIn(c, r, COMPUTER);
        if (turn == OVER) {
            showEndgameMessage("You lose!");
        }
        else {
            turn = PLAYER;
        }
    }, 500);

}



/**
 * Pick a random column to put the token in.
 * 
 * @returns column number
 */
function makeRandomMove() {

    return Math.floor(Math.random() * MAX_COLS);

}



/**
 * Pick the best column to put the token in,
 * according to the weights:
 * - if can win, win
 * - otherwise, try block the player from winning
 * - otherwise, set self up to win
 * 
 * @returns column number
 */
function makeBestMove() {

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
                    let connection = checkLine(c, r, y, x, PLAYER, false);
                    score += PLAYER_COSTS[connection];
                }
                else if (boardGrid[col][row] == COMPUTER) {
                    let connection = checkLine(c, r, y, x, COMPUTER, false);
                    score += COMPUTER_COSTS[connection];
                    if (connection == 3) {
                        turn = OVER;
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

    return c;

}



/**
 * Check the connectivity of the current line,
 * going through the hole indicated by (c, r) + n(y, x).
 * 
 * @param {Integer} c       hole's column
 * @param {Integer} r       hole's row
 * @param {Integer} y       column-shift 
 * @param {Integer} x       row-shift
 * @param {String} counter  who's counters make up the line
 * @returns 
 */
function checkLine(c, r, y, x, counter, post) {

    c = parseInt(c);
    r = parseInt(r);
    let connection = 0;
    let holeC = c;
    let holeR = r;
    let furthestC = c;
    let furthestR = r;

    // Find furthest match in OG direction
    c += parseInt(y);
    r += parseInt(x);
    while (isOnBoard(c, r) && ((boardGrid[c][r] == counter))) {

        furthestC = c;
        furthestR = r;
    
        connection++;
        
        c += y;
        r += x;
        
    }

    // Find connection, extending across gap
    connection = 0;
    c = furthestC;
    r = furthestR;
    while (isOnBoard(c, r) && ((boardGrid[c][r] == counter) || ((c == holeC) && (r == holeR)))) {

        if ((c != holeC) || (r != holeR) || post) {
            connection++;
        }

        c -= y;
        r -= x;

    }

    if (connection > 4) {
        connection = 4;
    }

    return connection;
    
}

//////////////////// ENDGAME ////////////////////

/**
 * Checks if the player just won.
 * @param {Integer} c the column they just placed their token in
 * @param {Integer} r the row their token ended up in
 * @returns boolean
 */
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
    
        let connection = checkLine(c, r, y, x, PLAYER, true);
        if (connection > 3) {
            return true;
        }

    }

    return false;

}



/**
 * Disables the board and shows a message to the user,
 * depending on if they won/lost.
 * 
 * @param {String} message 
 */
function showEndgameMessage(message) {

    turn = OVER;

    showMessage(message);

    let button = document.getElementById("again");
    button.style.display = "block";

}



/**
 * Show a regular message.
 * 
 * @param {String} message
 */
function showMessage(message) {

    let modal = document.getElementsByClassName("modal")[0];
    let p = document.getElementById("endgameMessage");
    p.innerHTML = message;
    modal.style.display = "block";

    setTimeout(() => modal.style.display = "none", 2000);

}