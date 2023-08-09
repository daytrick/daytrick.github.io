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

//////////////////// OTHER CONSTS ////////////////////

const factID = document.getElementById("factID");
const factText = document.getElementById("fact");



/**
 * Keep getting and showing facts forever.
 */
function keepShowingFacts() {

    setTimeout(() => {
        
        getRandomFact();

    }, 60000);

}
window.onload = keepShowingFacts;


/**
 * Query for a random fact from the database.
 * 
 * How to query a random doc from: https://stackoverflow.com/a/46801925
 */
async function getRandomFact() {

    // Generate a random ID
    let randID = doc(collection(db, "funfacts")).id;
    console.log(randID);

    // Get a random fact
    // How to query from: https://firebase.google.com/docs/firestore/query-data/get-data
    // How to use where from: https://firebase.google.com/docs/firestore/query-data/queries?hl=en&authuser=0
    // How to order and limit from: https://firebase.google.com/docs/firestore/query-data/order-limit-data?authuser=0&hl=en
    let q = query(facts, where("__name__", ">=", randID), limit(1));

    let querySnapshot = await getDocs(q);

    // Make sure there's a fact
    if (querySnapshot.empty) {
        q = query(facts, where("__name__", "<", randID), limit(1));
        querySnapshot = await getDocs(q);
    }

    // Get the document out
    querySnapshot.forEach((doc) => {
        showFact(doc);
    })
    

}
// Make it callable in the console
// How to do so from: https://stackoverflow.com/a/50216696
window.getRandomFact = getRandomFact;



/**
 * Show a fact.
 * @param {QueryDocumentSnapshot} doc the fact
 */
function showFact(doc) {

    // Display the fact ID
    factID.innerHTML = doc.id;

    // Display the fact text
    let fact = doc.data();
    factText.innerHTML = fact.fact;

}
