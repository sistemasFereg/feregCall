importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
firebase.initializeApp({
  apiKey: "AIzaSyB3iG1C4TOTda1Cp5o4x4Df4wgjlnw5EHA",
  authDomain: "fereg-sr.firebaseapp.com",
  projectId: "fereg-sr",
  storageBucket: "fereg-sr.appspot.com",
  messagingSenderId: "1073184985324",
  appId: "1:1073184985324:web:23d213e6ebdd43829ad5c9"
});
const messaging = firebase.messaging();