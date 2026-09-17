window.AdsManager = (function() {
    let adDestroyed = false;

    function init() {
        const container = document.getElementById('ad-container-main');
        // If the ad was already destroyed for this session, never reload it
        if (!container || adDestroyed) return;

        if (!window.AppConfig.ADS_ENABLED) {
            // Development Placeholder
            container.innerHTML = `
                <div class="w-full min-h-[90px] max-w-[728px] mx-auto flex flex-col items-center justify-center bg-slate-900/30 border border-slate-800/50 rounded-xl text-slate-500 text-sm panel-3d">
                    <span class="mb-1 text-slate-600 font-medium tracking-wide text-xs uppercase">Advertisement</span>
                    <span class="text-xs text-slate-700">(Native Ad reserved space)</span>
                </div>
            `;
        } else {
            // Production Ad Insertion - Native Ad Network
            container.innerHTML = `
                <div class="w-full flex justify-center items-center overflow-hidden panel-3d p-4 hide-in-sleep">
                    <!-- Native Banner Ad Container -->
                    <div id="container-2f6987ff81cedfe8bbf53e281494d0ea"></div>
                </div>
            `;
            
            try {
                // Dynamically inject the script so the browser actually executes it
                const script = document.createElement('script');
                script.async = true;
                script.dataset.cfasync = "false";
                script.src = "//pl31390608.profitableratecpmnetwork.com/2f6987ff81cedfe8bbf53e281494d0ea/invoke.js";
                document.body.appendChild(script);
            } catch (e) {
                console.error("[AdsManager] Failed to load Native Ad", e);
            }
        }
    }

    function handleSleepModeEnter() {
        const container = document.getElementById('ad-container-main');
        if (container && !adDestroyed) {
            // Completely destroy the DOM node. Do NOT hide with CSS.
            // This is the compliant way to remove an ad from a Single Page App view.
            container.innerHTML = '';
            container.style.display = 'none'; // Collapse the empty parent
            
            // Lock the ad slot for the rest of the session to prevent policy violations 
            // caused by reloading/refreshing the ad if they exit Sleep Mode.
            adDestroyed = true;
            console.log("[AdsManager] Ad permanently removed for this session to protect sleep experience.");
        }
    }

    return { init, handleSleepModeEnter };
})();
