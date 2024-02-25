/**
 * Save the current canvas image as a JPEG.
 * 
 * How to save canvas drawing from: https://stackoverflow.com/a/54869638
 */
function save() {

    // Work out file name (first three words)
    let plaintext = document.getElementById("plaintext").value;
    let filename = plaintext.replace(/[^a-zA-Z0-9\s_-]/g, "")
                            .split(/\s/)
                            .slice(0, 3)
                            .join("-");
    filename = (filename.trim() == "" ? "blank" : filename);
    filename += ".jpeg";

    // Get image data
    let url = canvas.toDataURL("image/jpeg", 1.0);
    let a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

}