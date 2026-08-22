window.Storage = (function() {
    const MIXES_KEY = 'sleepsync_saved_mixes';

    function getMixes() {
        try {
            const data = localStorage.getItem(MIXES_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Failed to parse saved mixes:", e);
            return [];
        }
    }

    function saveCurrentMix(name) {
        const activeSounds = window.AudioEngine.getActiveSounds();
        if (Object.keys(activeSounds).length === 0) {
            alert("No sounds to save! Play some sounds first.");
            return false;
        }

        const mixData = {};
        for (const id in activeSounds) {
            mixData[id] = activeSounds[id].targetVolume;
        }

        const mixes = getMixes();
        mixes.push({
            id: 'mix_' + Date.now(),
            name: name || 'My Custom Mix',
            mix: mixData,
            createdAt: Date.now()
        });

        try {
            localStorage.setItem(MIXES_KEY, JSON.stringify(mixes));
            return true;
        } catch (e) {
            console.error("Storage limit exceeded:", e);
            return false;
        }
    }

    function deleteMix(id) {
        const mixes = getMixes().filter(m => m.id !== id);
        localStorage.setItem(MIXES_KEY, JSON.stringify(mixes));
    }

    function loadMix(id) {
        const mixes = getMixes();
        const preset = mixes.find(m => m.id === id);
        if (!preset) return;
        
        window.AudioEngine.stopAll();
        for (const [soundId, volume] of Object.entries(preset.mix)) {
            const soundData = window.SleepData.sounds.find(s => s.id === soundId);
            if (soundData) {
                window.AudioEngine.toggleSound(soundId, soundData.file, volume);
            }
        }
        window.UI.renderAll();
    }

    return { getMixes, saveCurrentMix, deleteMix, loadMix };
})();
