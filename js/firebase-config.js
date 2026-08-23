// Placeholder for Firebase Config
// IMPORTANT: The administrator must populate these fields from their Firebase Console
window.FirebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "G-YOUR_MEASUREMENT_ID"
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
