window.AdminApp = (function() {
    function initData() {
        const fb = window.initFirebase();
        if (fb) window.AdminDB.setDB(fb.db);

        window.AdminDB.loadConfiguration().then(() => {
            renderAll();
        });
    }

    function renderAll() {
        window.AdminUI.renderSounds();
        window.AdminUI.renderPresets();
        window.AdminUI.renderLayout();
        window.AdminUI.renderSettings();
    }

    // Tab Navigation
    document.addEventListener('DOMContentLoaded', () => {
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active state
                navBtns.forEach(b => {
                    b.classList.remove('bg-indigo-900/40', 'text-indigo-300');
                    b.classList.add('text-slate-400');
                });
                e.target.classList.remove('text-slate-400');
                e.target.classList.add('bg-indigo-900/40', 'text-indigo-300');

                // Switch views
                document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden', 'block'));
                const targetId = e.target.getAttribute('data-target');
                document.querySelectorAll('.view-section').forEach(v => {
                    if (v.id === targetId) {
                        v.classList.remove('hidden');
                        v.classList.add('block');
                    } else {
                        v.classList.remove('block');
                        v.classList.add('hidden');
                    }
                });

                document.getElementById('current-view-title').innerText = e.target.innerText.replace('✨ ', '');
            });
        });
    });

    return {
        initData,
        renderAll,
        saveDraft: () => window.AdminDB.saveDraft(),
        publish: () => window.AdminDB.publish(),
        rollback: () => {
            if(confirm("Are you sure you want to rollback the LIVE public site to the previous version?")) {
                window.AdminDB.rollback();
            }
        },
        preview: () => {
            alert("Preview mode opens the public site using your draft config. (Requires public site Firestore implementation)");
        }
    };
})();
