//////////////////// CONSTS ////////////////////

// Directory names
const LEFT = "left";
const RIGHT = "right";
const PROPS = "props";

// Sprite names
const BLINK = "blink";
const CROUCH = "crouch";
const EAT = "eat";
const GRAZE = "graze";
const MOO = "moo";
const SLEEP = "sleep";
const WALK = "walk";
const EXT = ".png";

const SUNRISE = "sunrise";
const DAY = "day";
const SUNSET = "sunset";
const NIGHT = "night";

const FOOD = "food";
const HAND = "hand";

// Moo audio from: https://freesound.org/people/Bird_man/sounds/275154/
const MOO_AUDIO = new Audio('sounds/moo.wav');

// Divs
let cow = document.getElementById("cow");
let food = document.getElementById("food");
let hand = document.getElementById("hand");

//////////////////// SPRITES ////////////////////

class Sprite {
    constructor(pose, frames) {
        this.pose = pose;
        this.frames = frames;
    }
}

const SPRITES = [
    new Sprite(BLINK, 1),
    new Sprite(CROUCH, 2),
    new Sprite(GRAZE, 7),
    new Sprite(MOO, 1),
    new Sprite(SLEEP, 2),
    new Sprite(WALK, 8)
];

//////////////////// LOADING ////////////////////

/**
 * Load the cow sprites.
 */
function loadCowSprites() {

    let directions = [LEFT, RIGHT];
    
    for (const direction of directions) {

        for (const sprite of SPRITES) {

            if (sprite.frames == 1) {

                let frame = createImage(direction, sprite.pose);
                frame.hidden = true;
                cow.appendChild(frame);
            
            }
            else {

                for (let i = 1; i <= sprite.frames; i++) {

                    let frame = createImage(direction, sprite.pose + i);
                    frame.hidden = true;
                    cow.appendChild(frame);

                }

            }

        }

    }

    let defaultPose = document.getElementById(generateID(LEFT, WALK + "1"));
    defaultPose.removeAttribute("hidden");

}


/**
 * Loads sprites for a prop, and shows the default sprite.
 * 
 * @param {FOOD | HAND} type        the prop name
 * @param {food | hand} parent      the div the sprites go in
 * @param {Number} limit            number of sprites the prop has
 * @param {Number} defaultSprite    number of the default sprite
 */
function loadProps(type, parent, limit, defaultSprite) {

    for (let i = 1; i <= limit; i++) {
        let sprite = createImage(PROPS, type + i);
        sprite.hidden = true;
        parent.appendChild(sprite);
    }

    let defaultPose = document.getElementById(generateID(PROPS, type + defaultSprite));
    defaultPose.removeAttribute("hidden");

}



/**
 * Create a HTMLImageElement for a given image.
 * 
 * @param {String} folder 
 * @param {String} fileName 
 * @returns HTMLImageElement
 */
function createImage(folder, fileName) {

    let img = document.createElement("img");
    img.src = getFilePath(folder, fileName);
    img.id = generateID(folder, fileName);
    return img;

}



/**
 * Generate an ID for an image.
 * 
 * @param {String} folder 
 * @param {String} fileName 
 * @returns the ID
 */
function generateID(folder, fileName) {

    return folder + "_" + fileName;

}



/**
 * Show the sprite with the provided ID,
 * and hide all the other sprites for that entity.
 * 
 * @param {String} id 
 */
function showSprite(id) {

    let sprite = document.getElementById(id);
    let entity = sprite.parentElement;

    for (const child of entity.childNodes) {
        child.hidden = true;
    }

    sprite.removeAttribute("hidden");

}