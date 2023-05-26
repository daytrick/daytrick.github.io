const WORLD_X = 20;
const WORLD_Y = 20;
const CLEAR = "🚫";
var lifeforms = ["🐮"];
var world = [];
var reap = false;


function load() {

    loadCells();
    loadLifeforms();

}

/**
 * Load cells when the page loads.
 */
function loadCells() {

    let grid = document.getElementsByClassName("grid")[0];
    world = [];

    for (var i = 0; i < WORLD_X; i++) {

        world.push([]);
        for (var j = 0; j < WORLD_Y; j++) {

            // HTML elements
            let cell = document.createElement("div");
            cell.id = i + "_" + j;
            cell.className = "cell";
            cell.onclick = function(){placeLife(cell)};
            grid.appendChild(cell);

            // 2D array
            world[i].push(null);

        }
    }

    console.log("Loaded cells!");

}



/**
 * Load lifeforms into the dropdown.
 */
function loadLifeforms() {

    let select = document.getElementById("lifeforms");

    for (lifeform of lifeforms) {
        let option = document.createElement("option");
        option.value = lifeform;
        option.innerHTML = lifeform;
        select.appendChild(option);
    }

}



/**
 * Put a lifeform into the cell.
 * 
 * @param {HTMLDivElement} cell 
 */
function placeLife(cell) {

    let lifeform = null;
    if (!reap) {
        let select = document.getElementById("lifeforms");
        lifeform = select.value;
    }
    
    // On HTML
    cell.innerHTML = lifeform;
    // console.log("Placed " + lifeform + " at cell " + cell.id);

    // 2D array
    [x, y] = cell.id.split("_");
    world[x][y] = lifeform;

}



/**
 * Allow reaping of lifeforms.
 */
function toggleReaping() {

    // How to depress button from: https://dev.to/nicm42/how-to-make-a-button-looked-like-it-s-staying-pressed-down-58k
    let reapButton = document.getElementById("reap");

    if (reap) {
        reapButton.classList.remove("active");
        reap = false;
    }
    else {
        reapButton.classList.add("active");
        reap = true;
    }

}



/**
 * Clears the world of all lifeforms.
 */
function clearWorld() {

    for (let x = 0; x < WORLD_X; x++) {
        for (let y = 0; y < WORLD_Y; y++) {

            let cell = document.getElementById(x + "_" + y);
            cell.innerHTML = "";

            world[x][y] = null;

        }
    }

}


