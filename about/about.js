const MAX_BLINK_INTERVAL = 20 * 1000;

const imgDiv = document.getElementById("aboutImage");
var pfpOpen = null;
var pfpBlink = null;

function load() {

    pfpOpen = loadImage("./pfps/pfp_open.png", true);
    pfpBlink = loadImage("./pfps/pfp_blink.png", false);
    blink();

}

function loadImage(path, visible) {

    let img = document.createElement("img");
    img.src = path;
    img.classList.add("pfp");
    if (!visible) {
        img.hidden = true;
    }
    imgDiv.appendChild(img);

    return img;

}

function blink() {

    let timeout = Math.random() * MAX_BLINK_INTERVAL;
    setTimeout(() => {
        
        pfpOpen.hidden = true;
        pfpBlink.removeAttribute("hidden");

        setTimeout(() => {

            pfpBlink.hidden = true;
            pfpOpen.removeAttribute("hidden");

        }, 200);
        
        blink();

    }, timeout);

}