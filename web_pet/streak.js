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
            visitedBefore = new Date(Date.parse(visitedBefore));
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

    if (streak == 0) {
        let today = new Date();
        let daysElapsed = getDiffInDays(lastVisit, today);
        p.innerHTML = `Days since last visit: ${daysElapsed}`;
    }
    else if (streak > 0) {
        p.innerHTML = `You've visited daily for: ${streak} days`;
    }
    else {
        p.innerHTML = "Hello there!";
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