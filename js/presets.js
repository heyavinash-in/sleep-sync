window.Presets = (function() {
    function loadPreset(presetId) {
        const preset = window.SleepData.presets.find(p => p.id === presetId);
        if (!preset) return;

        if (window.AppAnalytics) {
            window.AppAnalytics.logEvent('preset_selected', { preset_id: presetId });
        }
        
        window.AudioEngine.stopAll();
        
        for (const [soundId, volume] of Object.entries(preset.mix)) {
            const soundData = window.SleepData.sounds.find(s => s.id === soundId);
            if (soundData) {
                window.AudioEngine.toggleSound(soundId, soundData.file, volume);
            }
        }
        window.UI.renderAll();
    }

    return { loadPreset };
})();
