function onload() {
    background(255, 255, 255);
}



onkeydown = function(event) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lastPoint = new Point(50, 50);
    lowest = 50;
    rightmost = 50;

    if (event.key === "Enter") {
        plaintext = document.getElementById("plaintext").value;

        try {
            let text = new Text(plaintext);
            text.draw();
        }
        catch (e) {
            this.alert(e);
            throw e;
        }
        
    }
    
}