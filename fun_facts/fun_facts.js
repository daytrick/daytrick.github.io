// Import the functions you need from the SDKs you need
// Import method from: https://stackoverflow.com/a/69491450
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js"
import { collection, doc, getDoc, getDocs, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js"
import { query, orderBy, limit, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js"

//////////////////// FIREBASE CONSTS ////////////////////

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
    apiKey: "AIzaSyCviSKYylM0TFP2PI1jH4o_Z9uyzxlbftc",
    authDomain: "github-site---day.firebaseapp.com",
    projectId: "github-site---day",
    storageBucket: "github-site---day.appspot.com",
    messagingSenderId: "886469035409",
    appId: "1:886469035409:web:f2fd84419a81b047058630",
    measurementId: "G-D8NG8XVYGD"
};

// Initialize Firebase
const app = initializeApp(config);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const facts = collection(db, "funfacts");

//////////////////// FACT DISPLAY CONSTS ////////////////////

const factID = document.getElementById("factID");
const factDiv = document.getElementById("factDiv");
const sourcesDiv = document.getElementById("sourcesDiv");

// WPM from: https://speechify.com/blog/average-reading-speed-pages
const WPM = 200;
const SPW = 60 / WPM;
const S_TO_MS = 1000;
const LENGTH_TAX = 1.1;

//////////////////// PLAYBACK VARIABLES ////////////////////

const backButton = document.getElementById("back");
const playButton = document.getElementById("play");
const skipButton = document.getElementById("skip");

const BACK_SYM = "⏮";
const PLAY_SYM = "⏵";
const PAUSE_SYM = "⏸";
const SKIP_SYM = "⏭";

var timeout;
var currDoc;
const histMax = 5; // only allow 5 go-backs
var history = Array(histMax);
var histHead = 0;
var histLen = 0;

//////////////////// FILTER CONSTS ////////////////////

const TOPIC_KEY = "topics";
const filterForm = document.getElementById("filterForm");

//////////////////// FUNCTIONS ////////////////////

// // // // // // // LOADING // // // // // // //

function load() {
    keepShowingFacts();
    loadTopics();
}
window.onload = load();

/**
 * Keep getting and showing facts forever.
 */
function keepShowingFacts() {

    clearTimeout(timeout);

    getRandomFact().then(
        (data) => {
            console.log(data);
            let time = data;

            timeout = setTimeout(() => {
                keepShowingFacts();
            }, time);

        }
    );

}
// window.onload = keepShowingFacts;


// // // // PLAYBACK // // // //

/**
 * Pause the fact slideshow.
 */
function pause() {

    // Actually pause
    clearTimeout(timeout);
    // Change the button display
    playButton.innerHTML = PLAY_SYM;
    // Change the button behaviour
    playButton.onclick = play;

}

/**
 * Resume the fact slideshow.
 */
function play() {

    // Get a new fact
    keepShowingFacts();
    // Change the button display
    playButton.innerHTML = PAUSE_SYM;
    // Change the button behaviour
    playButton.onclick = pause;

}

playButton.onclick = pause;

/**
 * Display the previous fact again.
 */
function goBack() {

    // Clear the timeout
    clearTimeout(timeout);

    // Check that there's been a previous fact
    if (histLen > 0) {

        // Query for the previous fact
        getFact(popHist(), true).then(
            (data) => {
                console.log(data);
                let time = data;
    
                timeout = setTimeout(() => {
                    keepShowingFacts();
                }, time);
    
            }
        );

    }

}

backButton.onclick = goBack;
skipButton.onclick = keepShowingFacts;

// // // // QUERYING + DISPLAY // // // //


/**
 * Query for a random fact from the database.
 * 
 * How to query a random doc from: https://stackoverflow.com/a/46801925
 */
async function getRandomFact() {

    // Generate a random ID
    let randID = doc(collection(db, "funfacts")).id;
    console.log(randID);

    // Query for a fact with the closest ID
    return getFact(randID, false);

}
// Make it callable in the console
// How to do so from: https://stackoverflow.com/a/50216696
window.getRandomFact = getRandomFact;



/**
 * Get the fact with the closest ID larger than the provided document ID, and show it.
 * 
 * @param {String} id a Firebase document ID (20 chars)
 * @returns time it should be displayed for
 */
async function getFact(id, justPopped) {

    // Get the fact
    // How to query from: https://firebase.google.com/docs/firestore/query-data/get-data
    // How to use where from: https://firebase.google.com/docs/firestore/query-data/queries?hl=en&authuser=0
    // How to order and limit from: https://firebase.google.com/docs/firestore/query-data/order-limit-data?authuser=0&hl=en
    let q = query(facts, where("__name__", ">=", id), limit(1));

    let querySnapshot = await getDocs(q);

    // Make sure there's a fact
    if (querySnapshot.empty) {
        q = query(facts, where("__name__", "<", id), limit(1));
        querySnapshot = await getDocs(q);
    }

    // Get the document out
    let timeout;
    querySnapshot.forEach((doc) => {

        // Update the history
        if (!justPopped){
            pushHist(currDoc);
        }

        // Actually show the fact
        timeout = showFact(doc);

    });
    return timeout;

}



/**
 * Show a fact.
 * @param {QueryDocumentSnapshot} doc the fact
 */
function showFact(doc) {

    let fact = doc.data();

    // Display the fact ID
    currDoc = doc.id;
    factID.innerHTML = currDoc;

    // Display the fact text
    factDiv.innerHTML = "";
    for (const para of fact.fact) {
        let p = document.createElement("p");
        p.innerHTML = para;
        factDiv.appendChild(p);
    }

    // Display the sources
    sourcesDiv.innerHTML = "";

    if (fact.sources.length > 0) {

        let h2 = document.createElement("h2");
        h2.innerHTML = "Sources";
        sourcesDiv.appendChild(h2);

        let list = document.createElement("ol");
        for (const source of fact.sources) {
            let item = document.createElement("li");

            // Allow sources with no links
            if (source.hasOwnProperty("link")) {
                // How to get a Date from a Firebase Timestamp from: https://stackoverflow.com/a/57103780
                let date = new Date(source.accessed.seconds * 1000);
                item.innerHTML = `<a href="${source.link}">${source.name}.</a> Accessed ${date.toDateString()}.`;
            }
            else {
                item.innerHTML = source.name;
            }

            list.appendChild(item);

        }

        sourcesDiv.appendChild(list);

    }

    // Return length of fact (so can determine reading time)
    return calcDisplayTime(fact.length);

}



/**
 * Record a visited document in history.
 * 
 * @param {String} docID ID of the doc to push onto the history
 */
function pushHist(docID) {

    // Check if need to overwrite a doc
    if (histLen == histMax) {
        histHead = (histHead + 1) % histMax;
    }

    // Then move the tail
    let i = (histHead + histLen) % 5;
    history[i] = docID;
    histLen = Math.min(histLen + 1, 5);

}



/**
 * Get the ID of the previous doc.
 * 
 * @returns the previous doc ID, or false if there is none
 */
function popHist() {

    // Check that there's sth to pop
    if (histLen == 0) {
        return false;
    }
    // Otherwise, return doc at tail
    else {
        histLen--;
        let i = (histHead + histLen) % histMax;
        return history[i];
    }

}




/**
 * Calculate how long a fact should be displayed for, based on its length.
 * 
 * @param {Number} wordCount 
 * @returns number of milliseconds
 */
function calcDisplayTime(wordCount) {

    return wordCount * SPW * S_TO_MS * LENGTH_TAX;

}



// // // // FILTERING // // // //

/**
 * Crawl the DB for all the unique topics and their counts.
 * @returns dictionary of topic:count pairs
 */
async function getTopics() {

    // Req the topics for all docs in collection
    let q = query(facts, where(TOPIC_KEY, "!=", null));
    let querySnapshot = await getDocs(q);

    // Loop through to add each topic to dict
    // note: there's really no better way to do this??/ (https://stackoverflow.com/a/48025263)
    let topics = {};
    querySnapshot.forEach((doc) => {
        
        let fact = doc.data();
        for (const topic of fact.topics) {

            // Count how many occurences of the topic
            if (topic in topics) {
                topics[topic]++;
            }
            else {
                topics[topic] = 1;
            }

        }

    })

    return topics;

}



async function loadTopics() {

    let topics = await getTopics();
    let topicNames = Object.keys(topics).sort();

    for (const topic of topicNames) {

        let count = topics[topic];
        if (count >= 3) {
            addFilterableTopic(topic, count);
        }

    }

}

function addFilterableTopic(topic, count) {

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox"
    checkbox.value = topic;
    checkbox.checked = false;

    let label = document.createElement("label");
    label.for = topic;
    label.innerText = `${topic} (${count})`;

    let newLine = document.createElement("br");

    filterForm.appendChild(checkbox);
    filterForm.appendChild(label);
    filterForm.appendChild(newLine);

}
