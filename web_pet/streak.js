const streakDiv = document.getElementById("streak");

/**
 * Check the user's streak.
 */
function checkStreak() {

    let visitedBefore = getCookie("visit");
    let streak = parseInt(getCookie("streak"));
    
    // Get date of last visit
    if (visitedBefore != 0) {

        // Parse it as a Date
        visitedBefore = new Date(Date.parse(visitedBefore));

        // Get streak
        if (streak != 0) {

            // Increment streak if new day
            let today = new Date();
            if (getDiffInDays(visitedBefore, today) == 1) {
                streak++;
            }

        }

    }

    // Display the streak
    displayStreak(visitedBefore, streak);

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

    // No recorded last visit -> new visitor
    if (lastVisit == 0) {
        p.innerHTML = "Hello there!";
    }
    // Missed at least 1 day
    else if (streak == 0) {
        let today = new Date();
        let daysElapsed = getDiffInDays(lastVisit, today);
        p.innerHTML = `Days since last visit: ${daysElapsed}`;
    }
    // Streak
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
    expDate.setDate(visitDate.getDate() + 30);
    
    document.cookie = "visit = " + visitDate.toString() + ";" + expDate.toString() + ";path=/";
    document.cookie = "streak = " + newStreak + ";" + expDate.toString() + ";path=/"

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
    return 0;

}



/**
 * Get the difference between two dates as a number of full days.
 * 
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns number of full days
 */
function getDiffInDays(date1, date2) {

    let diff = date2.getTime() - date1.getTime();
    return Math.floor(diff / (1000 * 3600 * 24));

}