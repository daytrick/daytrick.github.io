/**
 * Rules followed with reference to: https://github.com/guardian/coding-exercises/tree/main/game-of-life
 */

const GO_BUTTON = document.getElementById("go");
const TRACKER = document.getElementById("tracker");
var generationNo = 0;

/**
 * Run for infinitely many generations.
 */
function goLive() {

    let timerID = setInterval(() => {
        runOneGeneration();
    }, 250);

    GO_BUTTON.classList.add("active");
    GO_BUTTON.innerHTML = "Stop Time Itself"
    GO_BUTTON.onclick = () => {goIntoStasis(timerID)};

}

/**
 * Pause everyone's living.
 * 
 * @param {Number} timerID 
 */
function goIntoStasis(timerID) {

    clearInterval(timerID);

    GO_BUTTON.classList.remove("active");
    GO_BUTTON.innerHTML = "It's alive!!!"
    GO_BUTTON.onclick = goLive;

}

/**
 * Run one generation.
 */
function runOneGeneration() {

    let newWorld = copyWorld();

    for (let x = 0; x < WORLD_X; x++) {

        for (let y = 0; y < WORLD_Y; y++) {

            if (world[x][y] == null) {
                checkBirthConditions(newWorld, x, y);
            }
            else {
                checkDeathConditions(newWorld, x, y);
            }

        }

    }

    world = newWorld;
    generationNo++;
    TRACKER.innerHTML = generationNo;

}



/**
 * Checks if an empty cell (pre-check) meets the birth requirements for any of the lifeforms.
 * 
 * @param {2DArray} newWorld 
 * @param {Number} x 
 * @param {Number} y 
 */
function checkBirthConditions(newWorld, x, y) {

    // Iterate through birth rules
    for (const [lifeform, rules] of Object.entries(globalCheckingFuncs)) {

        // Once one birth rule met, stop checking
        if (rules.birth(x, y)) {
            newWorld[x][y] = lifeform;
            updateCell(x, y, lifeform);
            break;
        }

    }

}



/**
 * Checks if a cell with a lifeform meets the death requirements for that lifeform.
 * 
 * @param {2DArray} newWorld 
 * @param {Number} x 
 * @param {Number} y 
 */
function checkDeathConditions(newWorld, x, y) {

    // Get lifeform
    let lifeform = world[x][y];

    // Check if it meets the dying conditions
    if (globalCheckingFuncs[lifeform].death(x, y)) {
        newWorld[x][y] = null;
        updateCell(x, y, null);
    }

}



/**
 * Updates a cell at (x, y) to hold the provided lifeform.
 * 
 * @param {Integer} x 
 * @param {Integer} y 
 * @param {Char} lifeForm 
 */
function updateCell(x, y, lifeForm) {

    let cell = document.getElementById(x + "_" + y);
    cell.innerHTML = lifeForm;

}



/**
 * Counts the number of neighbours the cell at (x, y) has,
 * including diagonals.
 *  
 * @param {Integer} x 
 * @param {Integer} y 
 * @returns 
 */
function countNeighbours(x, y) {

    let neighbours = 0;

    for (let i = -1; i <= 1; i++) {

        let nx = x + i;
        if ((0 > nx) || (nx >= WORLD_X)) {
            continue;
        }
        
        for (let j = -1; j <= 1; j++) {

            let ny = y + j;
            if ((0 <= ny) 
                && (ny < WORLD_Y)
                && !((i == 0) && (j == 0))
                && (world[nx][ny] != null)) {

                //console.log("Found neighbour at " + nx + ", " + ny + "(" + i + ", " + j + ")");
                neighbours++;

            }

        }

    }

    return neighbours;

}



/**
 * Copies world into a new 2D array.
 * 
 * @returns 2D array
 */
function copyWorld() {

    let newWorld = [];

    for (let x = 0; x < WORLD_X; x++) {

        newWorld.push([]);

        for (let y = 0; y < WORLD_Y; y++) {

            newWorld[x].push(world[x][y]);

        }

    }

    return newWorld;

}