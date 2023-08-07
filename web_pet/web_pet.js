//////////////////// SPRITES ////////////////////

// Cow movement restrictions
const COW_SPEED = 15;
const X_LIMIT = 550;

// Cow status tracking
const STATUS_EAT = "eat";
const EAT_EVENT = new Event(STATUS_EAT);
let cowFacing = LEFT;
let eating = false;
let petting = false;
let cowX = 350;

// Hand status tracking
let handCounter = 2;

// Timeout tracking
let timeouts = [];

//////////////////// LOADING ////////////////////

/**
 * Load the sprites and idle the cow.
 */
function onload() {
    loadBgs();
    loadCowSprites();
    //loadProps(FOOD, food, 3, 1);
    loadProps(HAND, hand, 4, 2);
    idle();
}

//////////////////// COW ACTIONS ////////////////////

/**
 * Idle animations for the cow.
 */
function idle() {

    timeouts.push(setTimeout(() => {

        let n = Math.floor(Math.random() * 1000);
        
        if (n < 300) {
            walk(getRandomXTarget(), idle);
        }
        else if ((n >= 300) && (n < 500)) {
            idleAction(BLINK, 200);
        }
        else if ((n >= 500) && (n < 700)) {
            moo();
        }
        else if ((n >= 700) && (n < 900)) {
            graze();
        }
        else {
            goToSleep();
        }

    }, Math.floor(Math.random() * 1000)));

}



/**
 * Detect when the food has been placed, so the cow can go eat it.
 */
cow.addEventListener(
    STATUS_EAT,
    (event) => {

        eating = true;

        // Locowe food
        let bodyWidth = document.body.clientWidth;
        let parentWidth = food.parentElement.clientWidth;
        let leftPadding = (bodyWidth - parentWidth) / 2;
        let foodBounds = food.getBoundingClientRect();
        let foodX = foodBounds.x - leftPadding + (foodBounds.width / 2);

        // Account for cow length
        let targetX = foodX;
        let cowBounds = cow.getBoundingClientRect();
        if (cowBounds.x < foodBounds.x) {
            targetX = targetX - cow.clientWidth;
        }
        
        // Stop any idle events
        clearAllTimeouts();

        // Go to food and eat it afterwards
        walk(targetX, eat);
    
    }
)



/**
 * Cow eats the food.
 */
function eat() {

    // Eat
    let counter = 0;
    (function loop() {
        timeouts.push(setTimeout(() => {

            if (counter > 15) {

                // Reset food bowl
                resetfood();

                // Idle cow
                showSprite(generateID(cowFacing, CROUCH));
                eating = false;
                idle();

            }
            else if ((counter % 2) == 0) {

                showSprite(generateID(cowFacing, CROUCH));

                if (counter == 10) {
                    showSprite(generateID(PROPS, FOOD + "3"));
                }

                loop();

            }
            else {

                showSprite(generateID(cowFacing, EAT));

                if (counter == 5) {
                    showSprite(generateID(PROPS, FOOD + "2"));
                }

                loop();

            }

            counter++;

        }, 100));
    })();

}


/**
 * Make the cow walk to a spot in the room.
 * 
 * @param targetX where the cow should walk
 * @param nextAction what the cow should do after arriving
 */
function walk(targetX, nextAction) {

    let cowVelocity = getCowVelocity(cowX, targetX);

    cowFacing = (cowX < targetX ? RIGHT : LEFT);
    let walkCounter = 1;

    // Recursively move until reach target
    // How to recurse setTimeout from: https://developer.mozilla.org/en-US/docs/Web/API/setInterval
    (function loop() {
        timeouts.push(setTimeout(() => {

            // Figure out how much to move
            if (Math.abs(targetX - cowX) < COW_SPEED) {
                cowX += targetX - cowX;
            }
            else {
                cowX += cowVelocity;
            }

            // Actually move
            cow.style.left = cowX + "px";
            showSprite(generateID(cowFacing, WALK + walkCounter));

            // Check if still need to move 
            if (cowX != targetX) {

                walkCounter = (walkCounter == 4 ? 1 : walkCounter + 1);
                loop();

            }
            else {

                // End cycle in default stance
                showSprite(generateID(cowFacing, WALK + "1"));
                nextAction();

            }

        }, 100));
    })();

}



/**
 * Make the cow go to sleep.
 */
function goToSleep() {

    let sleepCounter = 1;

    crouch();

    (function loop() {

        timeouts.push(setTimeout(() => {

            showSprite(generateID(cowFacing, SLEEP + sleepCounter));
            sleepCounter = (sleepCounter == 1 ? 2 : 1);
            loop();

        }, 2000));

    })();

}



/**
 * Make the cow graze for a bit.
 */
function graze() {

    let grazeCounter = 1;

    (function loop() {

        timeouts.push(setTimeout(() => {

            showSprite(generateID(cowFacing, GRAZE + grazeCounter));

            if (grazeCounter != 7) {

                grazeCounter++;
                loop();

            }
            else {

                let n = Math.floor(Math.random() * 1000);

                let sign = Math.floor(Math.random() * 100);
                let dist = Math.floor(Math.random() * 100);
                
                let x = cowX + (dist * (sign < 50 ? -1 : 1));
                if (x < 0) {
                    x = 0;
                }
                else if (x > X_LIMIT) {
                    x = X_LIMIT;
                }

                walk(x, (n < 100 ? idle : graze));
                
            }

        }, 200));

    })();

}

function crouch() {

    showSprite(generateID(cowFacing, CROUCH + 1));

    timeouts.push(setTimeout(() => {
        showSprite(generateID(cowFacing, CROUCH + 2));
    }, 100));

}



/**
 * Start petting.
 */
function startPet() {

    clearAllTimeouts();
    petting = true;
    showSprite(generateID(cowFacing, BLINK));

}



/**
 * Stop petting.
 */
function stopPet() {

    if (petting) {
        clearAllTimeouts();
        showSprite(generateID(cowFacing, WALK + "1"));
        petting = false;
        idle();
    }

}



/**
 * Make the cow do an idle animation.
 * 
 * @param {String} action   the idle action
 * @param {Number} time     how long to do it for
 */
function idleAction(action, time) {

    showSprite(generateID(cowFacing, action));

    if (action == MOO) {
        MOO_AUDIO.play();
    }

    timeouts.push(setTimeout(() => {
        showSprite(generateID(cowFacing, WALK + "1"));
        idle();
    }, time));
    
}



/**
 * Make the cow moo. 
 * 
 * How to play audio from: https://stackoverflow.com/a/18628124
 */
function moo() {

    showSprite(generateID(cowFacing, MOO));

    MOO_AUDIO.play()
        .then(() => {

            // Match how long the cow stays in the mooing pose to how long the moo audio is.
            // Found appropriate event listener from: https://stackoverflow.com/a/11104033
            MOO_AUDIO.addEventListener("ended", onMooEnd);

        })
        .catch((err) => {

            // Hold the moo pose even if the audio doesn't play, but estimate the duration
            timeouts.push(setTimeout(() => {
                onMooEnd();
            }, 1000));

        });

}


/**
 * Event listener for when the moo audio ends.
 */
function onMooEnd() {
    showSprite(generateID(cowFacing, WALK + "1"));
    idle();
    MOO_AUDIO.removeEventListener("ended", onMooEnd);
}



//////////////////// INTERACTIONS ////////////////////

food.onclick = pickUpFood;
hand.ondblclick = changeHand;
document.addEventListener("mousemove", useCustomHand);


/**
 * Make the user's pointer into a giant 8-bit hand
 * (to pet the cow with).
 * @param {MouseEvent} event a mousemove event
 */
function useCustomHand(event) {

    let width = hand.clientWidth;
    let height = hand.clientHeight;

    let x = event.pageX;
    let y = event.pageY;

    let parent = hand.parentElement;
    let bounds = parent.getBoundingClientRect();

    if (checkWithinBounds(bounds, x, y) && !checkWithinBounds(food.getBoundingClientRect(), x, y)) {
        hand.removeAttribute("hidden");
        hand.style.left = x - (width / 2) + "px";
        hand.style.top = y - (height / 2) + "px";

        if (checkWithinBounds(cow.getBoundingClientRect(), x, y) && !eating) {
            startPet();
        }
        else {
            stopPet();
        }

    }
    else {
        hand.hidden = true;
    }
    
}



/**
 * Allow the user to change the hand colour.
 */
function changeHand() {

    handCounter = (handCounter == 4 ? 1 : handCounter + 1);
    showSprite(generateID(PROPS, HAND + handCounter));
    
}



/**
 * Pick up the food.
 */
function pickUpFood() { 

    food.onclick = putFoodDown;
    document.removeEventListener("mousemove", useCustomHand);
    document.addEventListener("mousemove", followMouse);

}



/**
 * Make the food follow the mouse
 * (for use after it's been picked up).
 * @param {MouseEvent} event a mousemove event
 */
function followMouse(event) {

    food.classList.remove("base");
    food.classList.remove("placed");
    food.classList.add("held");

    food.style.position = "fixed";
    food.style.removeProperty("bottom");
    food.style.removeProperty("right");

    // Get image dimensions so can centre it
    // How to get image dimensions from: https://stackoverflow.com/a/623174
    let width = food.clientWidth;
    let height = food.clientHeight;

    // How to get mouse position from: https://stackoverflow.com/a/7143883
    let newX = event.pageX - (width / 2);
    let newY = event.pageY - (height / 2);

    // Get parent bounds so can make sure it stays in frame
    // How to get parent bounds from: https://stackoverflow.com/a/11396681
    let parent = food.parentElement;
    let bounds = parent.getBoundingClientRect();

    let rightBound = bounds.right - width;
    let bottomBound = bounds.bottom - height;

    if (bounds.left > newX) {
        food.style.left = bounds.left + "px";
    }
    else if (newX > rightBound) {
        food.style.left = rightBound + "px";
    }
    else {
        food.style.left = newX + "px";
    }

    if (bounds.top > newY) {
        food.style.top = bounds.top + "px";
    }
    else if (newY > bottomBound) {
        food.style.top = bottomBound + "px";
    }
    else {
        food.style.top = newY + "px";
    }

}



/**
 * Put the food down
 * (for use after it's been picked up).
 * 
 * @param {MouseEvent} event a click
 */
function putFoodDown(event) {

    // Remove the listener that makes the food follow the mouse
    document.removeEventListener("mousemove", followMouse);
    document.addEventListener("mousemove", useCustomHand);

    let absX = event.clientX;

    let bodyWidth = document.body.clientWidth;
    let parentWidth = food.parentElement.clientWidth;
    let leftPadding = (bodyWidth - parentWidth) / 2;

    let width = food.clientWidth;

    food.classList.remove("base");
    food.classList.remove("held");
    food.classList.add("placed");

    food.style.position = "absolute";
    food.style.removeProperty("top");
    food.style.removeProperty("right");
    food.style.left = (absX - leftPadding - (width / 2)) + "px";
    food.style.bottom = 0;

    food.onclick = null;

    cow.dispatchEvent(EAT_EVENT);
    
}



/**
 * Reset the food button
 * (for use after the cow has finished eating).
 */
function resetfood() {

    food.classList.remove("held");
    food.classList.remove("placed");
    food.classList.add("base");

    food.style.position = "absolute";
    food.style.top = "80px";
    food.style.right = "10px";
    food.style.removeProperty("left");
    food.style.removeProperty("bottom");

    showSprite(generateID(PROPS, FOOD + "1"));

    food.onclick = pickUpFood;

}


//////////////////// HELPERS ////////////////////

/**
 * Construct a full file path,
 * given the direction the cow is facing,
 * and the desired action.
 * 
 * @param {String} folder 
 * @param {String} fileName 
 * @returns the file path
 */
function getFilePath(folder, fileName) {

    return folder + "/" + fileName + EXT;

}



/**
 * Get a random x target within the frame.
 */
function getRandomXTarget() {
    return Math.floor(Math.random() * X_LIMIT);
}



/**
 * Calculate the cow's velocity to a target.
 * 
 * @param {Number} cowX 
 * @param {Number} targetX 
 * @returns 
 */
function getCowVelocity(cowX, targetX) {

    if (cowX < targetX) {
        return COW_SPEED;
    }
    else if (cowX > targetX) {
        return 0 - COW_SPEED;
    }
    else {
        return 0;
    }

}



/**
 * Check whether a given x, y are within a set of bounds.
 * 
 * @param {DOMRect} bounds 
 * @param {Number} x 
 * @param {Number} y 
 * @returns 
 */
function checkWithinBounds(bounds, x, y) {

    return (bounds.left <= x) && (bounds.right > x) && (bounds.top <= y) && (bounds.bottom > y);

}



/**
 * Clear all timeouts.
 */
function clearAllTimeouts() {

    for (const timeout of timeouts) {
        clearTimeout(timeout);
    }

}
