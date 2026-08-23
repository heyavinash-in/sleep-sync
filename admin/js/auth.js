window.AdminAuth = (function() {
    let currentUser = null;
    let isAdmin = false;

    function init() {
        if (!window.initFirebase) return;
        const fb = window.initFirebase();
        if (!fb) return;

        const auth = fb.auth;
        const db = fb.db;

        // Listen for auth state changes
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                // Verify admin status via Firestore security rule pattern
                try {
                    const doc = await db.collection('adminUsers').doc(user.uid).get();
                    if (doc.exists) {
                        currentUser = user;
                        isAdmin = true;
                        document.getElementById('auth-overlay').classList.add('hidden');
                        if (window.AdminApp) window.AdminApp.initData();
                    } else {
                        // User exists but is not an admin
                        throw new Error("Unauthorized access. Admin privileges required.");
                    }
                } catch (error) {
                    console.error("Auth Error:", error);
                    showError(error.message || "Access denied.");
                    auth.signOut();
                }
            } else {
                currentUser = null;
                isAdmin = false;
                document.getElementById('auth-overlay').classList.remove('hidden');
            }
        });

        // Form Submission
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('auth-email').value;
                const password = document.getElementById('auth-password').value;
                
                auth.signInWithEmailAndPassword(email, password)
                    .catch(error => {
                        showError("Invalid credentials or configuration.");
                    });
            });
        }
    }

    function showError(msg) {
        const errEl = document.getElementById('auth-error');
        if (errEl) {
            errEl.innerText = msg;
            errEl.classList.remove('hidden');
        }
    }

    function logout() {
        const fb = window.initFirebase();
        if (fb && fb.auth) {
            fb.auth.signOut();
        }
    }

    return {
        init,
        logout,
        getUser: () => currentUser,
        isAuthorized: () => isAdmin
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    if (window.AdminAuth) window.AdminAuth.init();
});
