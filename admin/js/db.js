window.AdminDB = (function() {
    let db = null;
    let localDraft = null; // In-memory working copy
    let isDraftModified = false;

    // We initialize db from AdminAuth once authorized
    function setDB(firestoreInstance) {
        db = firestoreInstance;
    }

    // Use placeholder data if Firebase is not connected (for testing UI)
    const MOCK_DATA = {
        settings: {
            title: "SleepSync",
            description: "Your personal ambient environment."
        },
        sounds: [
            { id: 'rain', name: 'Rain', description: 'Soft rainfall', icon: '🌧️', file: 'rain.mp3', enabled: true, order: 1 },
            { id: 'fire', name: 'Fireplace', description: 'Warm crackling fire', icon: '🔥', file: 'campfire.mp3', enabled: true, order: 2 }
        ],
        presets: [
            { id: 'rainy_night', name: 'Rainy Night', icon: '🌙', mix: { rain: 0.8 }, enabled: true, order: 1 }
        ],
        layout: [
            { id: 'library', name: 'Sound Library', enabled: true, order: 1 },
            { id: 'mixer', name: 'Current Mix', enabled: true, order: 2 },
            { id: 'timer', name: 'Sleep Timer', enabled: true, order: 3 },
            { id: 'presets', name: 'Presets & Mixes', enabled: true, order: 4 },
            { id: 'seo', name: 'Helpful Info', enabled: true, order: 5 }
        ]
    };

    async function loadConfiguration() {
        if (!db) {
            localDraft = JSON.parse(JSON.stringify(MOCK_DATA));
            return localDraft;
        }

        try {
            // Prefer draft if it exists, otherwise fall back to published
            let doc = await db.collection('draftConfig').doc('latest').get();
            if (!doc.exists) {
                doc = await db.collection('publishedConfig').doc('latest').get();
            }

            if (doc.exists) {
                localDraft = doc.data();
            } else {
                localDraft = JSON.parse(JSON.stringify(MOCK_DATA));
            }
            return localDraft;
        } catch (e) {
            console.error("Failed to load config from Firestore", e);
            localDraft = JSON.parse(JSON.stringify(MOCK_DATA));
            return localDraft;
        }
    }

    function getDraft() {
        return localDraft;
    }

    function markModified() {
        isDraftModified = true;
        document.getElementById('draft-status').innerText = "Unsaved changes";
        document.getElementById('draft-status').classList.add('text-amber-400');
    }

    async function saveDraft() {
        if (!db) {
            console.log("Mock saved draft", localDraft);
            isDraftModified = false;
            updateStatus("Draft saved locally");
            return;
        }

        try {
            localDraft.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('draftConfig').doc('latest').set(localDraft);
            isDraftModified = false;
            updateStatus("Draft saved to cloud");
        } catch (e) {
            console.error("Save Draft Error", e);
            alert("Failed to save draft. Check permissions.");
        }
    }

    async function publish() {
        if (!db) {
            alert("Mock Publish Successful! (Firebase not connected)");
            return;
        }

        try {
            const batch = db.batch();
            
            // 1. Archive current published config
            const currentPub = await db.collection('publishedConfig').doc('latest').get();
            if (currentPub.exists) {
                const archiveRef = db.collection('configHistory').doc('v_' + Date.now());
                batch.set(archiveRef, currentPub.data());
            }

            // 2. Write draft to published
            const pubRef = db.collection('publishedConfig').doc('latest');
            localDraft.publishedAt = firebase.firestore.FieldValue.serverTimestamp();
            batch.set(pubRef, localDraft);

            await batch.commit();
            isDraftModified = false;
            updateStatus("Published successfully!");
        } catch (e) {
            console.error("Publish Error", e);
            alert("Failed to publish. Check permissions.");
        }
    }

    async function rollback() {
        if (!db) {
            alert("Mock Rollback Successful!");
            return;
        }

        try {
            // Find most recent history
            const history = await db.collection('configHistory').orderBy('publishedAt', 'desc').limit(1).get();
            if (history.empty) {
                alert("No history available for rollback.");
                return;
            }

            const previousData = history.docs[0].data();
            
            // Overwrite draft and published with history
            const batch = db.batch();
            batch.set(db.collection('publishedConfig').doc('latest'), previousData);
            batch.set(db.collection('draftConfig').doc('latest'), previousData);
            
            await batch.commit();
            
            // Reload local
            localDraft = previousData;
            window.AdminApp.renderAll();
            updateStatus("Rolled back to previous version.");
        } catch (e) {
            console.error("Rollback Error", e);
            alert("Failed to rollback.");
        }
    }

    function updateStatus(msg) {
        const el = document.getElementById('draft-status');
        if (el) {
            el.innerText = msg;
            el.classList.remove('text-amber-400');
            el.classList.add('text-slate-500');
        }
    }

    return { setDB, loadConfiguration, getDraft, markModified, saveDraft, publish, rollback };
})();
