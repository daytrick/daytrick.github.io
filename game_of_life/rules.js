//////////////////// CONSTANTS ////////////////////

const BIRTH = "birth";
const DEATH = "death";
const ATOM = "atom";
const AND = "and";
const OR = "or";

//////////////////// ELEMENT CREATION ////////////////////

// Adding ondrop & ondragover functions to the rules
for (rule of document.getElementsByTagName("rule")) {
    rule.ondrop = (event) => drop(event);
    rule.ondragover = (event) => {allowDrop(event)};
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

    let parent = elem.parentElement;

    if (parent.tagName.toLowerCase() == "blank") {

        parent.isBlank = true;
        parent.classList.remove("filled");

        let deleteBlanks = parent.getElementsByClassName("deleteBlank");
        if (deleteBlanks.length > 0) {
            deleteBlanks[0].removeAttribute("hidden");
        }

    }
    elem.remove();

}



/**
 * Add an AND to a rule.
 * 
 * @param {HTMLDivElement} parent the div containing the rule
 */
function addAnd(parent) {
    addOperative(parent, AND);
}

/**
 * Add an OR to a rule.
 * 
 * @param {HTMLDivElement} parent the div containing the rule
 */
function addOr(parent) {
    addOperative(parent, OR);
}

/**
 * Add a binary logical operator (AND/OR) to a rule.
 * 
 * @param {HTMLDivElement} parent the div containing the rule
 * @param {String} operator the operator ("and"/"or")
 */
function addOperative(parent, operator) {

    let rule = parent.getElementsByTagName("rule")[0];

    let operative = document.createElement(operator);
    operative.id = generateID();
    operative.draggable = true;
    operative.ondragstart = (event) => {drag(event)};

    let blank1 = createBlank();
    let span = createSpan(operator);
    let blank2 = createBlank();
    let plus = createPlus(operative, operator);
    let x = createX("close", () => {deleteElement(operative)});

    operative.appendChild(blank1);
    operative.appendChild(span);
    operative.appendChild(blank2);
    operative.appendChild(plus);
    operative.appendChild(x);

    rule.appendChild(operative);

}



/**
 * Add a BLANK to an AND/OR.
 * 
 * @param {HTMLElement} parent the AND/OR
 * @param {String} type the tag name ("and"/"or")
 * @param {*} plus the element it should be inserted before (the parent's + button)
 */
function addBlank(parent, type, plus) {

    let span = createSpan(type);
    let blank = createBlank();
    let x = createX("deleteBlank", () => {removeBlank(span, blank)});
    blank.appendChild(x);

    parent.insertBefore(span, plus);
    parent.insertBefore(blank, plus);

}



/**
 * Remove a blank from an AND/OR.
 * 
 * @param {HTMLSpanElement} span the span linking this blank to the preceding bit of the AND/OR
 * @param {*} blank the blank
 */
function removeBlank(span, blank) {

    span.remove();
    blank.remove();

}



/**
 * Create a linking span for use between the blanks of an AND/OR.
 * 
 * @param {String} text "and"/"or"
 * @returns HTMLSpanElement
 */
function createSpan(text) {

    let span = document.createElement("span");
    span.innerHTML = " " + text + " ";
    return span;

}



/**
 * Create a blank for an AND/OR.
 * 
 * @returns HTMLBlankElement
 */
function createBlank() {

    let blank = document.createElement("blank");
    blank.ondrop = (event) => drop(event);
    blank.ondragover = (event) => {allowDrop(event)};
    blank.isBlank = true;
    
    return blank;

}



/**
 * Create a + button for an AND/OR, which adds a new blank.
 * 
 * @param {HTMLElement} parent the AND/OR element
 * @param {String} type "and"/"or"
 * @returns HTMLSpanElement
 */
function createPlus(parent, type) {

    let plus = document.createElement("span");
    plus.classList.add("plus");
    plus.innerHTML = "+";
    plus.onclick = () => {addBlank(parent, type, plus)};

    return plus;
    
}



/**
 * Creates an X button (delete button) for either
 * a blank, clause, AND, or OR, depending on parameters.
 * 
 * @param {String} className class of the X button
 * @param {*} onclickFunc what it does when clicked
 * @returns HTMLButtonElement
 */
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
 * Allow something to be dragged into:
 * - an empty BLANK
 * - back into the rule
 * unless the something is the same as what it's being dragged into.
 * 
 * @param {Event} ev 
 */
function allowDrop(ev) {

    if ((ev.target.isBlank) || (ev.target.tagName.toLowerCase() == "rule")) {
        ev.preventDefault();
    }

}

/**
 * Drop something into an element.
 * 
 * @param {Event} ev 
 */
function drop(ev) {

    let data = ev.dataTransfer.getData("text");
    let draggable = document.getElementById(data);
    let parent = draggable.parentElement;
    let target = ev.target;
    let targetWrapper = ((target.tagName.toLowerCase() == "blank") ? target.parentElement : target);

    // Don't allow direct nesting of the same element types
    if (draggable.tagName != targetWrapper.tagName) {
        
        // Allow the drag
        ev.preventDefault();
        
        // Allow newly-emptied blanks to be dragged into again
        if (parent.tagName.toLowerCase() == "blank") {

            parent.isBlank = true;
            parent.classList.remove("filled");

            let deleteBlanks = parent.getElementsByClassName("deleteBlank");
            if (deleteBlanks.length > 0) {
                deleteBlanks[0].removeAttribute("hidden");
            }

        }

        // Stop other things from being dragged into a newly-filled blank
        // but keep allowing drags into the rule
        if (ev.target.tagName.toLowerCase() == "blank") {

            ev.target.isBlank = false;
            ev.target.classList.add("filled");

            let deleteBlanks = ev.target.getElementsByClassName("deleteBlank");
            if (deleteBlanks.length > 0) {
                deleteBlanks[0].hidden = true;
            }

        }

        // Actually drag the draggable into its new position
        console.log("Appended!");
        ev.target.appendChild(draggable);

    }

}
