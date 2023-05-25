/**
 * Rules followed with reference to: https://github.com/guardian/coding-exercises/tree/main/game-of-life
 */

const GO_BUTTON = document.getElementById("go");

/**
 * Run for infinitely many generations.
 */
function goLive() {

    let timerID = setInterval(() => {
        runOneGeneration();
    }, 250);

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

            let neighbours = countNeighbours(x, y);

            if (world[x][y] == null) {

                if (neighbours == 3) {
                    newWorld[x][y] = lifeforms[0];
                    updateCell(x, y, lifeforms[0]);
                }

            }
            else {

                if ((neighbours < 2) || (neighbours > 3)) {
                    newWorld[x][y] = null;
                    updateCell(x, y, null);
                }

            }

        }

    }

    world = newWorld;

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