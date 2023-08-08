// Import the functions you need from the SDKs you need
// Import method from: https://stackoverflow.com/a/69491450
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore, AutoId } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"
import { collection, doc, getDoc, getDocs, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"
import { query, orderBy, limit, where, onSnapshot } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"

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
const facts = db.collection("funfacts");


/**
 * Query for a random fact from the database.
 * 
 * How to query a random doc from: https://stackoverflow.com/a/46801925
 */
function getRandomFact() {

    // Generate a random ID
    let randID = new AutoId.newId();
    console.log(randID);

    // Get a random fact
    // How to use where from: https://firebase.google.com/docs/firestore/query-data/queries?hl=en&authuser=0
    // How to order and limit from: https://firebase.google.com/docs/firestore/query-data/order-limit-data?authuser=0&hl=en
    let query = facts.where("__name__", ">=", randID)
                     .orderBy("__name__")
                     .limit(1);

    query.get().then((querySnapshot) => {

        // Get first fact
        if (querySnapshot.empty) {

            let backupQuery = facts.where("__name__", "<", randID)
                                   .orderBy("__name__")
                                   .limit(1);
            
            // Will succeed by now, as long as there's at least one doc in the collection
            backupQuery.get().then((backupQuerySnapshot) => {
                showFact(backupQuerySnapshot);
            });
            
        }
        else {
            showFact(querySnapshot);
        }
    });

}



function showFact(querySnapshot) {

    console.log(querySnapshot);

}

/*// Get a document
const docRef = doc(db, "funfacts");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}*/