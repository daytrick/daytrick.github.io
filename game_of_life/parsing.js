//////////////////// FROM HMTL ////////////////////


function parseHTMLRule(rule) {

    let megaClause = rule.children[0];
    let obj = {};

    switch (megaClause.tagName) {
        case ATOM:
            parseHTMLAtom(megaClause);
            break;
        case AND:
            parseHTMLAnd(megaClause);
            break;
        case OR:
            parseHTMLOr(megaClause);
            break;
        default:
            alert("There's something wrong with your rules!");
            break;
    }

}

function parseHTMLAtom(atom) {

    let atomJSON = {};

    
}


//////////////////// FROM JSON ////////////////////

function parseJSONRules(rules) {

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
function parseJSONRule(rule) {

    return (x, y) => {

        let res = true;

        // Will only loop once, since is passed a single key-value pair
        Object.entries(rule).forEach(([key, value]) => {
            switch (key) {
                case ATOM:
                    res = parseJSONAtom(value)(x, y);
                    break;
                case AND:
                    res = parseJSONAnd(value);
                    break;
                case OR:
                    res = parseJSONOr(value);
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
function parseJSONOr(or) {

    return (x, y) => {

        let res = false;

        or.forEach((obj) => {

            let [key, value] = Object.entries(obj)[0];

            switch (key) {
                case ATOM:
                    res = res || parseJSONAtom(value)(x, y);
                    break;
                case AND:
                    res = res || parseJSONAnd(value);
                    break;
                case OR:
                    res = res || parseJSONOr(value);
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
function parseJSONAnd(and) {

    return (x, y) => {

        let res = true;

        and.forEach((obj) => {

            let [key, value] = Object.entries(obj)[0];

            switch (key) {
                case ATOM:
                    res = res && parseJSONAtom(value)(x, y);
                    break;
                case AND:
                    res = res && parseJSONAnd(value);
                    break;
                case OR:
                    res = res && parseJSONOr(value);
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
function parseJSONAtom(atom) {

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