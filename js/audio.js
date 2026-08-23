window.AudioEngine = (function() {
    const activeNodes = {}; 
    let masterVolume = 1.0;
    let fadeMultiplier = 1.0;

    // Magic Track Variables
    const magicTracks = ['1.mp3', '2.mp3', '3.mp3'];
    let magicAudio = null;
    let currentMagicIndex = 0;
    let magicIsPlaying = false;
    let magicTargetVolume = 0.5;

    function updateActualVolumes() {
        for (const id in activeNodes) {
            const finalVol = activeNodes[id].targetVolume * masterVolume * fadeMultiplier;
            activeNodes[id].audio.volume = Math.max(0, Math.min(1, finalVol));
        }
        
        if (magicAudio) {
            const finalMagicVol = magicTargetVolume * masterVolume * fadeMultiplier;
            magicAudio.volume = Math.max(0, Math.min(1, finalMagicVol));
        }
    }

    function playNextMagic() {
        currentMagicIndex = (currentMagicIndex + 1) % magicTracks.length;
        magicAudio.src = magicTracks[currentMagicIndex];
        magicAudio.play().catch(e => console.error("Auto-play next track failed", e));
        if (window.UI) window.UI.renderAll();
    }

    return {
        toggleSound: function(id, file, volume = 0.5) {
            if (activeNodes[id]) {
                activeNodes[id].audio.pause();
                delete activeNodes[id];
                if (window.AppAnalytics) window.AppAnalytics.logEvent('sound_stopped', { sound_id: id });
            } else {
                const audio = new Audio(file);
                audio.loop = true;
                activeNodes[id] = { audio, targetVolume: volume };
                updateActualVolumes();
                
                audio.play().then(() => {
                    if (window.AppAnalytics) window.AppAnalytics.logEvent('sound_play', { sound_id: id });
                }).catch(e => {
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

        // --- MAGIC METHODS ---
        toggleMagic: function() {
            if (magicIsPlaying) {
                if (magicAudio) magicAudio.pause();
                magicIsPlaying = false;
            } else {
                if (!magicAudio) {
                    magicAudio = new Audio(magicTracks[currentMagicIndex]);
                    magicAudio.addEventListener('ended', playNextMagic);
                }
                magicTargetVolume = 0.5; // default
                updateActualVolumes();
                magicAudio.play().catch(e => {
                    console.error("Magic play failed", e);
                    alert("Cannot play Magic music.");
                });
                magicIsPlaying = true;
            }
        },
        setMagicVolume: function(vol) {
            magicTargetVolume = parseFloat(vol);
            updateActualVolumes();
        },
        getMagicState: () => ({
            isPlaying: magicIsPlaying,
            volume: magicTargetVolume,
            trackNum: currentMagicIndex + 1
        }),

        // --- GLOBAL METHODS ---
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
            if (magicAudio) {
                magicAudio.pause();
                magicIsPlaying = false;
            }
        },
        getActiveSounds: () => activeNodes,
        getMasterVolume: () => masterVolume
    };
})();
