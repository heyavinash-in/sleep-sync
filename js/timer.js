window.Timer = (function() {
    let interval = null;
    let targetTime = null;
    const FADE_DURATION_MS = 30000; // 30 seconds

    function start(minutes) {
        if (!minutes || minutes <= 0) {
            alert("Please enter a valid number of minutes.");
            return;
        }

        stop(); // Clear any existing timer
        targetTime = Date.now() + (minutes * 60000);
        
        window.UI.showTimerDisplay(true);
        tick(); // Immediate initial render
        interval = setInterval(tick, 1000);
        
        // Auto-enter sleep mode
        toggleSleepMode(true);
    }

    function stop() {
        if (interval) clearInterval(interval);
        interval = null;
        targetTime = null;
        
        window.AudioEngine.setFadeMultiplier(1.0); // Reset volume multiplier
        window.UI.showTimerDisplay(false);
        toggleSleepMode(false);
    }

    function tick() {
        const remaining = targetTime - Date.now();
        
        if (remaining <= 0) {
            window.AudioEngine.stopAll();
            stop();
            window.UI.renderAll();
            return;
        }

        window.UI.updateTimerDisplay(remaining);

        // Fade out logic
        if (remaining <= FADE_DURATION_MS) {
            const fadeRatio = Math.max(0, remaining / FADE_DURATION_MS);
            window.AudioEngine.setFadeMultiplier(fadeRatio);
        }
    }

    function toggleSleepMode(force) {
        const body = document.body;
        const isSleeping = force !== undefined ? force : !body.classList.contains('sleep-mode');
        
        if (isSleeping) {
            body.classList.add('sleep-mode');
            window.UI.updateSleepModeBtn(true);
            
            if (window.AppAnalytics && force === undefined) {
                window.AppAnalytics.logEvent('sleep_mode_entered');
            }

            if (window.AdsManager) window.AdsManager.handleSleepModeEnter();
        } else {
            body.classList.remove('sleep-mode');
            window.UI.updateSleepModeBtn(false);
        }
    }

    return { start, stop, toggleSleepMode };
})();
