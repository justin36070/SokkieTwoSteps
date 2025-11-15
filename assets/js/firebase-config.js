// assets/js/firebase-config.js
const firebaseConfig = {
  apiKey: "AIza....",
  authDomain: "sokkietwosteps.firebaseapp.com",
  projectId: "sokkietwostep",
  storageBucket: "sokkietwosteps.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();