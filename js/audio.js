window.AudioEngine = (function() {
    const activeNodes = {}; 
    let masterVolume = 1.0;
    let fadeMultiplier = 1.0;

    function updateActualVolumes() {
        for (const id in activeNodes) {
            const finalVol = activeNodes[id].targetVolume * masterVolume * fadeMultiplier;
            activeNodes[id].audio.volume = Math.max(0, Math.min(1, finalVol));
        }
    }

    return {
        toggleSound: function(id, file, volume = 0.5) {
            if (activeNodes[id]) {
                activeNodes[id].audio.pause();
                delete activeNodes[id];
            } else {
                const audio = new Audio(file);
                audio.loop = true;
                activeNodes[id] = { audio, targetVolume: volume };
                updateActualVolumes();
                
                audio.play().catch(e => {
                    console.error("Audio play failed:", e);
                    delete activeNodes[id];
                    alert('Cannot play sound. Make sure ' + file + ' is in the folder.');
                });
            }
        },
        setVolume: function(id, volume) {
            if (activeNodes[id]) {
                activeNodes[id].targetVolume = volume;
                updateActualVolumes();
            }
        },
        setMasterVolume: function(volume) {
            masterVolume = volume;
            updateActualVolumes();
        },
        setFadeMultiplier: function(multiplier) {
            fadeMultiplier = multiplier;
            updateActualVolumes();
        },
        stopAll: function() {
            for (const id in activeNodes) {
                activeNodes[id].audio.pause();
                delete activeNodes[id];
            }
        },
        getActiveSounds: () => activeNodes,
        getMasterVolume: () => masterVolume
    };
})();
