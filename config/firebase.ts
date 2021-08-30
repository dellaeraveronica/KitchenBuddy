import * as firebase from 'firebase/app';

// Config info unique to your project
const firebaseConfig = {
    apiKey: "AIzaSyB76OKyN0ZQUwA-YHtOvZV4Fp5ruoHgKiY",
    authDomain: "the-fridge-c2a67.firebaseapp.com",
    projectId: "the-fridge-c2a67",
    storageBucket: "the-fridge-c2a67.appspot.com",
    messagingSenderId: "159746970013",
    appId: "1:159746970013:web:569170eac9b1e192a85f74"
};

// Initialize Firebase
const Firebase = firebase.default.initializeApp(firebaseConfig);

// Export the Firebase App so the rest of the app can have access to it
export default Firebase;
