import { initializeApp } from "[gstatic.com](https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js)";
import { getAuth } from "[gstatic.com](https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js)";
import { getFirestore, enableIndexedDbPersistence } from "[gstatic.com](https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js)";

const firebaseConfig = {
  apiKey: "AIzaSyDpTPibk-7_kqyJdfN94KrLlcKkoNnqIYE",
  authDomain: "farmledger-e85e3.firebaseapp.com",
  projectId: "farmledger-e85e3",
  storageBucket: "farmledger-e85e3.firebasestorage.app",
  messagingSenderId: "922324809308",
  appId: "1:922324809308:web:05c015ce12e55034e99899",
  measurementId: "G-8E5B8HD94R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch(err => {
  if (err.code === 'failed-precondition') console.warn('Offline persistence: multiple tabs open');
  else if (err.code === 'unimplemented') console.warn('Offline persistence not supported');
});

export { auth, db };
