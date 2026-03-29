/* ============================================================
   DREAM GREEN — Firebase Configuration
   NOTE: You must replace these placeholder values with your
   actual Firebase project configuration from the Firebase console.
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyAqI47m0TcUeQZ_kiFus40M0XwOQqGCS4I",
  authDomain: "dream-green-production.firebaseapp.com",
  projectId: "dream-green-production",
  storageBucket: "dream-green-production.firebasestorage.app",
  messagingSenderId: "795137067442",
  appId: "1:795137067442:web:53e8003253577319f7bcab",
  measurementId: "G-BPSWB315MW"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Services
const db = firebase.firestore();
const auth = firebase.auth();

// Enable offline persistence
db.enablePersistence()
  .catch(function (err) {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      console.warn('Firestore persistence failed: multiple tabs open');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn('Firestore persistence is not supported by this browser');
    }
  });
