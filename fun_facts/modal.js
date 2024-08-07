////////// MODAL //////////
// Copied from: https://www.w3schools.com/howto/howto_css_modals.asp

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var filterButton = document.getElementById("filterButton");

// Get the <span> element that closes the modal
var closeSpan = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
filterButton.onclick = function() {
    modal.style.display = "block";
    
}

// When the user clicks on <span> (x), close the modal
closeSpan.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}