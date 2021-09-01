import * as firebase from 'firebase/app';

// Config info unique to your project
const firebaseConfig = {
apiKey: "AIzaSyCqVrSA7_Ui7Z19qolddyBFr0lHb8fweXU",
  authDomain: "kitchenbuddy-9c17c.firebaseapp.com",
  projectId: "kitchenbuddy-9c17c",
  storageBucket: "kitchenbuddy-9c17c.appspot.com",
  messagingSenderId: "228852070271",
  appId: "1:228852070271:web:9dc901102cb3ad2a2ecc4a"
};

// Initialize Firebase
const Firebase = firebase.default.initializeApp(firebaseConfig);

// Export the Firebase App so the rest of the app can have access to it
export default Firebase;
