function onload() {
    // background(255, 255, 255);
    drawBackground();
}

/**
 * Draw the background.
 */
function drawBackground() {
    // Draw rectangle over canvas so it'll show up in saved images (just the bg doesn't)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Reset for joins - they need black fill
    ctx.fillStyle = "black";
}



onkeyup = function(event) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    lastPoint = new Point(50, 50);
    lowest = 50;
    rightmost = 50;

    plaintext = document.getElementById("plaintext").value;

    try {
        if (plaintext !== "") {
            let text = new Text(plaintext);
            text.draw(); 
        }
    }
    catch (e) {
        this.alert(e);
        throw e;
    }
    
}