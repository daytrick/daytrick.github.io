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
const MIDNIGHT = "midnight";
const TIME_NAMES = [SUNRISE, DAY, SUNSET, NIGHT];

const FOOD = "haybale";
const HAND = "hand";

// Moo audio from: https://freesound.org/people/Bird_man/sounds/275154/
const MOO_AUDIO = new Audio('sounds/moo.wav');

let sunriseTime;
let sunsetTime;
let times = {};
let bgTimeouts = [];

// Divs
let background = document.getElementById("background");
let cow = document.getElementById("cow");
let food = document.getElementById("food");
let hand = document.getElementById("hand");

//////////////////// SPRITES ////////////////////

/**
 * Class representing a set of sprites for an entity.
 */
class Sprite {
    /**
     * Create a Sprite.
     * 
     * @param {String} pose     name of pose
     * @param {Number} frames   number of frames in one animation cycle
     * @param {String} alt      description of entity and pose
     */
    constructor(pose, frames, alt) {
        this.pose = pose;
        this.frames = frames;
        this.alt = alt;
    }
}

const SPRITES = [
    new Sprite(BLINK, 1, "The cow, blinking."),
    new Sprite(CROUCH, 2, "The cow, crouching."),
    new Sprite(EAT, 7, "The cow, eating."),
    new Sprite(GRAZE, 7, "The cow, grazing."),
    new Sprite(MOO, 1, "The cow, mooing."),
    new Sprite(SLEEP, 2, "The cow, sleeping."),
    new Sprite(WALK, 8, "The cow, trotting.")
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

                let frame = createImage(direction, sprite.pose, sprite.alt);
                frame.hidden = true;
                cow.appendChild(frame);
            
            }
            else {

                for (let i = 1; i <= sprite.frames; i++) {

                    let frame = createImage(direction, sprite.pose + i, sprite.alt);
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
 * @param {String} alt              description of sprite
 */
function loadProps(type, parent, limit, defaultSprite, alt) {

    for (let i = 1; i <= limit; i++) {
        let sprite = createImage(PROPS, type + i, alt);
        sprite.hidden = true;
        parent.appendChild(sprite);
    }

    let defaultPose = document.getElementById(generateID(PROPS, type + defaultSprite));
    defaultPose.removeAttribute("hidden");

}



/**
 * Loads the backgrounds, and shows the appropriate one for the current time.
 */
function loadBgs() {

    for (const bg of TIME_NAMES) {
        let frame = createImage(PROPS, bg, `The pasture during ${bg}.`);
        frame.hidden = (bg != DAY);
        background.appendChild(frame);
    }

    getSunTimes();

}



/**
 * Get the sunrise/sunset times,
 * whether they're accurate or the default.
 */
function getSunTimes() {

    // Get user's coordinates
    // How to get them from: https://net-raft.com/Questions/740/how-to-get-latitude-and-longitude-from-ip-address-using-javascript-/740
    if (navigator.geolocation) {

        // If coordinates received, get accurate times
        // Otherwise, use default times
        navigator.geolocation.getCurrentPosition(makeSunTimesReq, useDefaultTimes);

    }

}



/**
 * Request the sunset/sunrise times for the user's location 
 * from https://sunrisesunset.io/api/.
 */
function makeSunTimesReq(position) {

    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let url = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${long}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data.status == "OK") {

                sunriseTime = parseTime(data.results.sunrise);
                sunsetTime = parseTime(data.results.sunset);

                times.sunrise = addMinutes(sunriseTime, -15);
                times.day = addMinutes(sunriseTime, 15);
                times.sunset = addMinutes(sunsetTime, -15);
                times.night = addMinutes(sunsetTime, 15);
                times.midnight = new Date();
                times.midnight.setDate(times.midnight.getDate() + 1);
                
                showAppropriateBg();

            }
        })
        .catch((error) => useDefaultTimes())
}



/**
 * Set sunrise/sunset times to a default.
 * For use when they can't be gotten from the API. 
 */
function useDefaultTimes() {

    /*sunriseTime = new Date();
    sunriseTime.setHours(6, 0, 0);
    sunsetTime = new Date();
    sunsetTime.setHours(19, 0, 0);*/

    times.sunrise = new Date();
    times.sunrise.setHours(5, 45, 0);
    times.day = new Date();
    times.day.setHours(6, 15, 0);
    times.sunset = new Date();
    times.sunset.setHours(18, 45, 0);
    times.night = new Date();
    times.night.setHours(19, 15, 0);
    times.midnight = new Date();
    times.midnight.setHours(0, 0, 0);
    times.midnight.setDate(times.midnight.getDate() + 1);

    showAppropriateBg();

}



/**
 * Show the appropriate background for the time of day.
 */
function showAppropriateBg() {

    let bg;
    let now = (new Date()).getTime();
    console.log(now);

    if (now < times.sunrise.getTime()) {
        bg = NIGHT;
    }
    else if (now < times.day.getTime()) {
        bg = SUNRISE;
    }
    else if (now < times.sunset.getTime()) {
        bg = DAY;
    }
    else if (now < times.night.getTime()) {
        bg = SUNSET;
    }
    else {
        bg = NIGHT;
    }
    
    showSprite(generateID(PROPS, bg));

    // Keep showing the appropriate bgs in the future
    setBgTimers();

}



/**
 * Set the timers for changing the background for each part of the day.
 */
function setBgTimers() {

    let now = new Date();

    // Prep the changes for the rest of today
    for (let i = 0; i < TIME_NAMES.length; i++) {

        // Calculate the timeout
        let timeout = times[TIME_NAMES[i]].getTime() - now.getTime();

        // Set an alarm to change the background if necessary
        if (timeout > 0) {

            setTimeout(() => {
                
                let newBg = document.getElementById(generateID(PROPS, TIME_NAMES[i]));
                let oldBg = document.getElementById(generateID(PROPS, TIME_NAMES[(i - 1 < 0 ? 0 : i - 1)]));

                newBg.removeAttribute("hidden");
                oldBg.setAttribute("hidden", true);

            }, timeout);

        }

    }
    
    // Set timeout to calculate changes for the next day at midnight
    let timeout = times.midnight.getTime() - now.getTime();
    setTimeout(() => {
        
        setBgTimers();

    }, timeout);
    
}



/**
 * Parse the time string and return it as a Date,
 * with the date set for today. 
 * 
 * @param {String} timeString time in hh:mm:ss AM/PM format
 * @returns a Date for today with the time
 */
function parseTime(timeString) {

    // Parse the time string
    let parts = timeString.split(/[\s:]/);
    if (parts[3] == "PM") {
        parts[0] = parseInt(parts[0]) + 12;
    }

    // Set the time
    let event = new Date();
    event.setHours(parts[0], parts[1], parts[2]);

    return event;

}



/**
 * Add some minutes to a Date object. 
 * Copied from: https://stackoverflow.com/a/1214753
 * 
 * @param {Date} date 
 * @param {Number} mins 
 * @returns 
 */
function addMinutes(date, mins) {
    console.log("New date: " + (new Date(date.getTime() + (mins*60000))));
    return new Date(date.getTime() + (mins*60000));
}



/**
 * Create a HTMLImageElement for a given image.
 * 
 * @param {String} folder 
 * @param {String} fileName 
 * @param {String} alt          description of the image
 * @returns HTMLImageElement
 */
function createImage(folder, fileName, alt) {

    let img = document.createElement("img");
    img.src = getFilePath(folder, fileName);
    img.id = generateID(folder, fileName);
    img.alt = alt;
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