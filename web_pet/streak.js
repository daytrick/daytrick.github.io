const streakDiv = document.getElementById("streak");

/**
 * Check the user's streak.
 */
function checkStreak() {

    let visitedBefore = getCookie("visit");
    let streak = getCookie("streak");
    
    // Get date of last visit
    if (visitedBefore) {

        console.log("Visited before!");

        // Get streak
        if (streak) {

            console.log("Got streak: " + streak);

            //Display streak
            let today = new Date();
            if (getDiffInDays(visitedBefore, today) == 1) {
                streak = parseInt(streak) + 1;
            }

        }
        else {

            // First meeting with cow
            streak = 0;

        }

    }

    // Display the streak
    displayStreak();

    // Record the visit
    recordVisit(streak);

}



/**
 * Display the user's streak.
 * 
 * @param {Date} lastVisit the last time user visited the page
 * @param {Number} streak days in a row the user has visited the page for
 */
function displayStreak(lastVisit, streak) {

    let p = document.createElement("p");

    if (!lastVisit) {
        p.innerHTML = "Hello there!";
    }
    else if (streak == 0) {
        let today = new Date();
        let daysElapsed = getDiffInDays(lastVisit, today);
        p.innerHTML = `Days since last visit: ${daysElapsed}`;
    }
    else {
        p.innerHTML = `You've visited daily for: ${streak} days`;
    }

    streakDiv.appendChild(p);

}



/**
 * Save visit data in the site cookies.
 * 
 * @param {Number} newStreak 
 */
function recordVisit(newStreak) {

    let visitDate = new Date();
    let expDate = new Date();
    expDate.setDate(visitDate.getDate() + 30)
    
    document.cookie = "visit = " + visitDate.toUTCString() + "; streak = " + newStreak + ";"+ expDate.toUTCString() + ";path=/";
    console.log("Cookies: " + document.cookie);

}



/**
 * Get a cookie.
 * 
 * Copied from: https://www.w3schools.com/js/js_cookies.asp 
 * 
 * @param {String} cname 
 * @returns the cookie value
 */
function getCookie(cname) {

    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for(let i = 0; i <ca.length; i++) {

      let c = ca[i];

      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }

      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }

    }
    return false;

}


/**
 * Compares two Date objects regarding just the date (year, month, date).
 * 
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns if date1 < date2
 */
function compareFullDate(date1, date2) {

    return date1.getUTCFullYear() < date2.getUTCFullYear()
        && date1.getUTCMonth() < date2.getUTCMonth()
        && date1.getUTCDate() < date2.getUTCDate();
    
}



function getDiffInDays(date1, date2) {

    let diff = date2.getTime() - date1.getTime();
    return diff / (1000 * 3600 * 24);

}