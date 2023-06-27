//////////////////// FROM HMTL ////////////////////

function parseHTMLRules() {

    try {

        let rulesJSON = {};

        // Get the new lifeform
        let lifeform = document.getElementById("lifeform").value;
        if (!validateLifeform(lifeform)) {
            throw new Error("Invalid lifeform symbol!");
        }

        // Parse the birth and death rules
        let rules = document.getElementsByTagName("rule");
        for (rule of rules) {
            
            // Get which life stage the rule is for
            let ruleType = rule.getAttribute("ruleType");
            let ruleContent = parseHTMLRule(rule);
            rulesJSON[ruleType] = ruleContent;

        }

        // Add it to the current rules
        globalRules[lifeform] = rulesJSON;

    }
    catch (error) {

        alert(error);

    }

}

/**
 * Parse a rule from the filled-out creator, 
 * and encode it in JSON format.
 * 
 * @param {HTMLRuleElement} rule 
 * @returns the rule as a JSON
 */
function parseHTMLRule(rule) {

    let children = rule.children;
    if (children.length == 1) {
        let megaClause = rule.children[0];
        let ruleContent = parseHTMLClause(megaClause);
        return ruleContent;
    }
    else {
        throw new Error("You have floating clauses!");
    }

}



/**
 * Parses a HTML clause and turns it into a JSON
 * by choosing the appropriate parsing function.
 * 
 * @param {HTMLAtomElement | HTMLAndElement | HTMLOrElement} clause 
 * @returns the JSON
 */
function parseHTMLClause(clause) {

    switch (clause.tagName.toLowerCase()) {
        case ATOM:
            return parseHTMLAtom(clause);
        case AND:
            return parseHTMLBinaryOperator(clause, AND);
        case OR:
            return parseHTMLBinaryOperator(clause, OR);
        default:
            alert("There's something wrong with your rules!");
            break;
    }

}



/**
 * Parse an AND or an OR HTML element and turn it into a JSON.
 * 
 * @param {HTMLAndElement | HTMLOrElement} op the AND/OR element
 * @param {String} type AND/OR
 * @returns the AND/OR as a JSON
 */
function parseHTMLBinaryOperator(op, type) {

    let clauseArray = [];

    // Parse each clause
    let blanks = op.getElementsByTagName(BLANK);
    for (blank of blanks) {

        if (!blank.isBlank) {

            let clause = blank.children[0];
            clauseArray.push(parseHTMLClause(clause));

        }

    }

    // Simplify it if there's only one filled blank
    if (clauseArray.length == 1) {
        return clauseArray[0];
    }
    else {
        return {[type]: clauseArray};
    }

}



/**
 * Parses an HTML atom and turns it into a JSON.
 * 
 * @param {HTMLAtomElement} atom 
 * @returns a JSON
 */
function parseHTMLAtom(atom) {

    let atomJSON = {};

    // Figure out type of equivalence
    let select = atom.getElementsByTagName("select")[0];

    if (select.value == BETWEEN) {

        let inputSpan = atom.getElementsByClassName(BETWEEN)[0];
        let bounds = inputSpan.getElementsByClassName(BOUND);
        let bound1 = bounds[0].value;
        let bound2 = bounds[1].value;

        if ((0 < bound1) && (bound1 <= 9) && (0 < bound2) && (bound2 <= 9)) {
            atomJSON[BETWEEN] = [bounds[0].value, bounds[1].value];
        }
        else {
            throw new Error("Illegal bound values: " + bound1 + " and " + bound2);
        }

    }
    else if (select.value == EQ || select.value == MIN || select.value == MAX) {
        
        let inputSpan = atom.getElementsByClassName(select.value)[0];
        let bounds = inputSpan.getElementsByClassName(BOUND);
        let bound = bounds[0].value;
        if ((0 < bound) && (bound <= 9)) {
            atomJSON[select.value] = bounds[0].value;
        }
        else {
            throw new Error("Illegal bound value: " + bound);
        }
        
    }
    else {
        throw new Error("Invalid neighbour requirements.");
    }

    // Figure out neighbour
    let neighbour = atom.getElementsByClassName(NEIGHBOUR)[0].value;
    if (neighbour != null && neighbour != undefined) {
        atomJSON[NEIGHBOUR] = neighbour;
    }
    else {
        throw new Error("Invalid neighbour symbol: " + neighbour);
    }

    return atomJSON;

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