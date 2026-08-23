// Placeholder for Firebase Config
// IMPORTANT: The administrator must populate these fields from their Firebase Console
window.FirebaseConfig = {
    apiKey: "AIzaSyAkfb4uqpzwvli79vPtd3LWfhmOjC3NStk",
    authDomain: "sleep-sync-464e1.firebaseapp.com",
    projectId: "sleep-sync-464e1",
    storageBucket: "sleep-sync-464e1.firebasestorage.app",
    messagingSenderId: "368284657244",
    appId: "1:368284657244:web:9dd5520af0c986c9d4a899",
    measurementId: "G-7FNZSZG20S"
};

// Initialize Firebase only if the config has been populated
window.initFirebase = function() {
    if (window.FirebaseConfig.apiKey === "YOUR_API_KEY") {
        console.warn("Firebase is not configured. Falling back to local data.");
        return null;
    }

    try {
        const app = firebase.initializeApp(window.FirebaseConfig);
        const db = firebase.firestore();
        const auth = firebase.auth();
        const storage = firebase.storage();
        
        let analytics = null;
        if (typeof firebase.analytics === 'function' && window.FirebaseConfig.measurementId) {
            analytics = firebase.analytics();
        }

        return { app, db, auth, storage, analytics };
    } catch (e) {
        console.error("Firebase initialization error", e);
        return null;
    }
};
