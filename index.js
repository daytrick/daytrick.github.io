/**
 * 
 * @param {HTMLDivElement} flexbox 
 */
function showDesc(flexbox) {

    let title = flexbox.getElementsByClassName("flexbox_title")[0];
    let desc = flexbox.getElementsByClassName("flexbox_desc")[0];

    title.setAttribute("hidden", true);
    desc.removeAttribute("hidden");

    console.log("Showing description!");

}



function hideDesc(flexbox) {

    let title = flexbox.getElementsByClassName("flexbox_title")[0];
    let desc = flexbox.getElementsByClassName("flexbox_desc")[0];

    title.removeAttribute("hidden");
    desc.setAttribute("hidden", true);

    console.log("Hiding description!");

}