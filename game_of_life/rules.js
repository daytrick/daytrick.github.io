//////////////////// CONSTANTS ////////////////////

const BIRTH = "birth";
const DEATH = "death";
const ATOM = "atom";
const AND = "and";
const OR = "or";
const BLANK = "blank";

const EQ = "eq";
const MIN = "min";
const MAX = "max";
const BETWEEN = "between";
const COMP_OPTS = {[EQ]: "exactly", [MIN]: "at least", [MAX]: "at most", [BETWEEN]: "between"};
const BOUND = "bound";
const NEIGHBOUR = "neighbour";

const EMOJI_REGEX = /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])$/;

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
 * Paint a new ATOM onto the appropriate rule's div.
 * 
 * @param {HTMLDivElement} parent the div
 */
function addAtom(parent) {
    
    let rule = parent.getElementsByTagName("rule")[0];

    let atom = document.createElement(ATOM);
    atom.id = generateID();
    atom.draggable = true;
    atom.ondragstart = (event) => {drag(event)};

    let span1 = document.createElement("span");
    span1.innerHTML = " there are ";

    let comparisonElements = createComparison();
    let select = comparisonElements[0];
    let values = comparisonElements[1];

    let span2 = document.createElement("span");
    span2.innerHTML = " neighbouring ";
    let neighbour = document.createElement("select");
    neighbour.classList.add(NEIGHBOUR);
    loadLifeforms(neighbour);
    let x = createX("close", () => {deleteElement(atom)});

    atom.appendChild(span1);
    atom.appendChild(select);
    atom.appendChild(values);
    atom.appendChild(span2);
    atom.appendChild(neighbour);
    atom.appendChild(x);

    rule.appendChild(atom);

}



/**
 * Creates the elements for choosing how many neighbours apply to an ATOM.
 * 
 * @returns [HTMLSelectElement, HTMLSpanElement]
 */
function createComparison() {

    let select = document.createElement("select");
    let values = document.createElement("span");
    let index = 0;

    for (const [key, value] of Object.entries(COMP_OPTS)) {
        
        // Create the option
        let option = document.createElement("option");
        option.value = key;
        option.innerHTML = value;
        select.appendChild(option);

        // Create the input method
        let inputSpan = document.createElement("span");
        inputSpan.classList.add(key);
        
        if (key != EQ) {
            inputSpan.hidden = true;
        }
        else {
            index = select.getElementsByTagName("option").length - 1;
        }

        let num1 = document.createElement("input");
        num1.classList.add(BOUND);
        num1.type = "number";
        num1.min = 1;
        num1.max = 8;
        inputSpan.appendChild(num1);

        if (key == BETWEEN) {

            let connective = createSpan(AND);
            inputSpan.appendChild(connective);

            let num2 = document.createElement("input");
            num2.classList.add(BOUND);
            num2.type = "number";
            num2.min = 1;
            num2.max = 8;
            inputSpan.appendChild(num2);

        }

        values.appendChild(inputSpan);

    }

    select.selectedIndex = index;
    select.onchange = () => changeValueSpan(select);

    return [select, values];

}



/**
 * Delete the given HTMLElement.
 * 
 * @param {HTMLElement} elem the element
 */
function deleteElement(elem) {

    let parent = elem.parentElement;

    if (parent.tagName.toLowerCase() == BLANK) {

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

    let blank = document.createElement(BLANK);
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
 * a blank, ATOM, AND, or OR, depending on parameters.
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
    let targetWrapper = ((target.tagName.toLowerCase() == BLANK) ? target.parentElement : target);

    // Don't allow direct nesting of the same element types
    if (draggable.tagName != targetWrapper.tagName) {
        
        // Allow the drag
        ev.preventDefault();
        
        // Allow newly-emptied blanks to be dragged into again
        if (parent.tagName.toLowerCase() == BLANK) {

            parent.isBlank = true;
            parent.classList.remove("filled");

            let deleteBlanks = parent.getElementsByClassName("deleteBlank");
            if (deleteBlanks.length > 0) {
                deleteBlanks[0].removeAttribute("hidden");
            }

        }

        // Stop other things from being dragged into a newly-filled blank
        // but keep allowing drags into the rule
        if (ev.target.tagName.toLowerCase() == BLANK) {

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



//////////////////// UPDATING ////////////////////

/**
 * Update the select options for the rules in the lifeform creator.
 * 
 * @param {String} lifeform the lifeform (value of the input box)
 */
function changeLifeform(lifeform) {

    // Remove previous temp lifeform from lifeforms array (if applicable)
    if (changeLifeform.tempLifeform != null) {
        let index = lifeforms.indexOf(changeLifeform.tempLifeform);
        lifeforms.splice(index, 1);
    }

    // Add lifeform to lifeforms array
    if (lifeforms.includes(lifeform)) {
        changeLifeform.tempLifeform = null;
    }
    else {
        lifeforms.push(lifeform);
        changeLifeform.tempLifeform = lifeform;
    }

    // Update all the neighbour selects in the creator
    let creator = document.getElementById("creation");
    let selects = creator.getElementsByClassName(NEIGHBOUR);
    for (const select of selects) {
        loadLifeforms(select);
    }

}



/**
 * Shows the correct number input boxes for the type of comparison
 * chosen in the select.
 * 
 * @param {HTMLSelectElement} select 
 */
function changeValueSpan(select) {

    let value = select.value;
    let valueSpans = select.nextSibling;
    let spans = valueSpans.children;

    for (span of spans) {
        if (span.classList.contains(value)) {
            span.removeAttribute("hidden");
        }
        else {
            span.hidden = true;
        }
    }

}


//////////////////// SAVING ////////////////////

function saveLifeform() {

    // Parse the lifeform
    if (parseHTMLRules()) {

        // Then encode it as functions
        parseJSONRules(globalRules);

        // Update the lifeform-picker
        let lifeformPicker = document.getElementById("lifeforms");
        loadLifeforms(lifeformPicker);

        // Clear the creator
        let lifeform = document.getElementById("lifeform");
        lifeform.value = "";
        for (rule of document.getElementsByTagName("rule")) {
            rule.innerHTML = "";
        }
        changeLifeform.tempLifeform = null;

    }

    
}