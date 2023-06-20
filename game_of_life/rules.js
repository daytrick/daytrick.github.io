const BIRTH = "birth";
const DEATH = "death";
const ATOM = "atom";
const AND = "and";
const OR = "or";


let clauseCounter = 0;


/**
 * Paint a new clause onto the appropriate rule's div.
 * 
 * @param {HTMLDivElement} parent the div
 */
function addClause(parent) {
    
    let rule = parent.getElementsByTagName("rule")[0];

    let clause = document.createElement("clause");

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
    let x = document.createElement("span");
    x.classList.add("close");
    x.innerHTML = "✖";
    x.onclick = () => {deleteClause(clause)}

    clause.appendChild(span1);
    clause.appendChild(num1);
    clause.appendChild(span2);
    clause.appendChild(neighbour);
    clause.appendChild(x);

    let br = document.createElement("br");

    rule.appendChild(clause);

}



/**
 * Delete the given clause.
 * 
 * @param {HTMLClauseElement} clause the clause
 */
function deleteClause(clause) {

    clause.remove();

}



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