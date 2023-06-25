//////////////////// CONSTANTS ////////////////////

const BIRTH = "birth";
const DEATH = "death";
const ATOM = "atom";
const AND = "and";
const OR = "or";

//////////////////// ELEMENT CREATION ////////////////////

document.getElementsByTagName("rule")

for (rule of document.getElementsByTagName("rule")) {
    rule.ondrop = (event) => drop(event, false);
    rule.ondragover = (event) => {allowDrop(event); console.log('on rule')};
}

/**
 * Generate an ID for an ATOM/AND/OR.
 * 
 * Copied from Danny Apostolov's reply to: https://stackoverflow.com/a/20061123
 * @returns ID
 */
function generateID() { 
    return generateID.__current++; 
}; 
generateID.__current = 0;


/**
 * Paint a new clause onto the appropriate rule's div.
 * 
 * @param {HTMLDivElement} parent the div
 */
function addClause(parent) {
    
    let rule = parent.getElementsByTagName("rule")[0];

    let clause = document.createElement("clause");
    clause.id = generateID();
    clause.draggable = true;
    clause.ondragstart = (event) => {drag(event)};

    let span1 = document.createElement("span");
    span1.innerHTML = " there are ";
    let num1 = document.createElement("input");
    num1.type = "number";
    num1.min = 1;
    num1.max = 8;
    let span2 = document.createElement("span");
    span2.innerHTML = " neighbouring ";
    let neighbour = document.createElement("select");
    loadLifeforms(neighbour);
    let x = createX("close", () => {deleteElement(clause)});

    clause.appendChild(span1);
    clause.appendChild(num1);
    clause.appendChild(span2);
    clause.appendChild(neighbour);
    clause.appendChild(x);

    rule.appendChild(clause);

}



/**
 * Delete the given HTMLElement.
 * 
 * @param {HTMLElement} elem the element
 */
function deleteElement(elem) {

    if (elem.parentElement.tagName == "blank") {
        elem.parentElement.isBlank = false;
    }
    elem.remove();

}



function addAnd(parent) {

    let rule = parent.getElementsByTagName("rule")[0];

    let and = document.createElement("and");
    and.id = generateID();
    and.draggable = true;
    and.ondragstart = (event) => {drag(event)};

    let blank1 = createBlank();
    let span = createSpan(AND);
    let blank2 = createBlank();
    let plus = createPlus(and, AND);
    let x = createX("close", () => {deleteElement(and)});

    and.appendChild(blank1);
    and.appendChild(span);
    and.appendChild(blank2);
    and.appendChild(plus);
    and.appendChild(x);

    rule.appendChild(and);

}



function addBlank(parent, type, plus) {

    let span = createSpan(type);
    let blank = createBlank();
    let x = createX("deleteBlank", () => {removeBlank(span, blank)});
    blank.appendChild(x);

    parent.insertBefore(span, plus);
    parent.insertBefore(blank, plus);

}



function removeBlank(span, blank) {

    span.remove();
    blank.remove();

}



function createSpan(text) {

    let span = document.createElement("span");
    span.innerHTML = " " + text + " ";
    return span;

}



function createBlank() {

    let blank = document.createElement("blank");
    blank.ondrop = (event) => {drop(event, true)};
    blank.ondragover = (event) => {allowDrop(event)};
    blank.isBlank = true;
    
    return blank;

}



function createPlus(parent, type) {

    let plus = document.createElement("span");
    plus.classList.add("plus");
    plus.innerHTML = "+";
    plus.onclick = () => {addBlank(parent, type, plus)};

    return plus;
    
}




function createX(className, onclickFunc) {

    let x = document.createElement("span");
    x.classList.add(className);
    x.innerHTML = "✖";
    x.onclick = onclickFunc;

    return x;
}



//////////////////// DRAGGING ////////////////////
/**
 * Dragging code based off: https://www.w3schools.com/html/html5_draganddrop.asp
 */

/** 
 * Initialise a drag.
 *  
 * @param {Event} ev 
 */
function drag(ev) {
    ev.dataTransfer.clearData();
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.dropEffect = "move";
}

/**
 * Allow something to be dragged into a blank element.
 * 
 * @param {Event} ev 
 */
function allowDrop(ev) {
    if (ev.target.isBlank || ev.target.tagName.toLowerCase() == "rule") {
        ev.preventDefault();
    }
}

/**
 * Drop something into an element.
 * 
 * @param {Event} ev 
 */
function drop(ev, wipe) {

    ev.preventDefault();

    let data = ev.dataTransfer.getData("text");
    let draggable = document.getElementById(data);
    
    // Allow blanks to be dragged into again
    draggable.parentElement.isBlank = true;
    if (wipe) {
        ev.target.innerHTML = "";
    }

    // Actually drag the draggable into its new position
    ev.target.appendChild(draggable);

    // Stop other things from being dragged into the newly-filled blank
    // but keep allowing drags into the rule
    if (ev.target.tagName.toLowerCase() == "blank") {
        ev.target.isBlank = false;
    }

}


//////////////////// PARSING ////////////////////

function parseRules(rules) {

    let checkingFuncs = {};

    // Iterate through lifeforms
    Object.entries(rules).forEach(([key, value]) => {

        checkingFuncs[key].birth = "blah"
    });

}



/**
 * Parses a rule (birth/death):
 * creates function that will evaluate whether a rule applies to a cell
 * 
 * @param {JSON} rule 
 * @returns the function, which takes an x and a y
 */
function parseRule(rule) {

    return (x, y) => {

        let res = true;

        // Will only loop once, since is passed a single key-value pair
        Object.entries(rule).forEach(([key, value]) => {
            switch (key) {
                case ATOM:
                    res = parseAtom(value)(x, y);
                    break;
                case AND:
                    res = parseAnd(value);
                    break;
                case OR:
                    res = parseOr(value);
                default:
                    console.log("Error parsing a rule: " + key);
                    break;
            }
        });

        return res;

    };

}



/**
 * Parses an OR:
 * creates function that loops through all clauses and ORs them together.
 * 
 * @param {Array} or
 * @returns a function that will check the OR statement for a cell, given an x and y
 */
function parseOr(or) {

    return (x, y) => {

        let res = false;

        or.forEach((obj) => {

            let [key, value] = Object.entries(obj)[0];

            switch (key) {
                case ATOM:
                    res = res || parseAtom(value)(x, y);
                    break;
                case AND:
                    res = res || parseAnd(value);
                    break;
                case OR:
                    res = res || parseOr(value);
                default:
                    console.log("Error parsing an OR: " + key);
                    break;
            }

        });

        return res;

    }
    
}



/**
 * Parses an AND:
 * creates function that loops through all clauses and ANDs them together.
 * 
 * @param {Array} and
 * @returns a function that will check the AND statement for a cell, given an x and y
 */
function parseAnd(and) {

    return (x, y) => {

        let res = true;

        and.forEach((obj) => {

            let [key, value] = Object.entries(obj)[0];

            switch (key) {
                case ATOM:
                    res = res && parseAtom(value)(x, y);
                    break;
                case AND:
                    res = res && parseAnd(value);
                    break;
                case OR:
                    res = res && parseOr(value);
                default:
                    console.log("Error parsing an AND: " + key);
                    break;
            }

        });

        return res;

    }
    
}



/**
 * Parses an ATOM:
 * creates function to check if a cell meets the rule's requirements
 * of a min/max/equal neighbour count.
 * 
 * @param {JSON} atom 
 * @returns the function, which takes an x and a y
 */
function parseAtom(atom) {

    let func;
    let neighbour = atom.neighbour;

    if ("eq" in atom) {
        func = (x, y) => {
            return takeCensus(x, y, neighbour) == atom.eq;
        }
    }
    else if ("min" in atom) {
        func = (x, y) => {
            return takeCensus(x, y, neighbour) >= atom.min;
        }
    }
    else if ("max" in atom) {
        func = (x, y) => {
            return takeCensus(x, y, neighbour) <= atom.max;
        }
    }
    else if ("between" in atom) {
        func = (x, y) => {
            let count = takeCensus(x, y, neighbour);
            return (atom.between[0] <= count) && (count <= atom.between[1]);
        }
    }
    else {
        console.log("Invalid atom!");
        func = (x, y) => {false}
    }

    return func;

}



/**
 * Check how many of a certain neighbour a cell has.
 * 
 * Ripped off from countNeighbours().
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {String} neighbour 
 * @returns 
 */
function takeCensus(x, y, neighbour) {

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
                && (world[nx][ny] == neighbour)) {

                neighbours++;

            }

        }

    }

    return neighbours;

}