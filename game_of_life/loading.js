const WORLD_X = 20;
const WORLD_Y = 20;
var lifeforms = ["🐮"];
var world = [];

function loadCells() {

    grid = document.getElementsByClassName("grid")[0];
    world = [];

    for (var i = 0; i < WORLD_X; i++) {

        world.push([]);
        for (var j = 0; j < WORLD_Y; j++) {

            // HTML elements
            let cell = document.createElement("div");
            cell.id = i + "_" + j;
            cell.className = "cell";
            cell.onclick = function(){placeLife(cell)};
            console.log("Placed onclick for cell " + cell.id)
            grid.appendChild(cell);

            // 2D array
            world[i].push(null);

        }
    }

    console.log("Loaded cells!");

}



function placeLife(cell) {

    // On HTML
    cell.innerHTML = lifeforms[0];
    console.log("Placed " + lifeforms[0] + " at cell " + cell.id);

    // 2D array
    [x, y] = cell.id.split("_");
    world[x][y] = lifeforms[0];

}

