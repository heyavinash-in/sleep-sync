window.AdsManager = (function() {
    let adDestroyed = false;

    function init() {
        const container = document.getElementById('ad-container-main');
        // If the ad was already destroyed for this session, never reload it
        if (!container || adDestroyed) return;

        if (!window.AppConfig.ADS_ENABLED) {
            // Development Placeholder
            container.innerHTML = `
                <div class="w-full min-h-[90px] max-w-[728px] mx-auto flex flex-col items-center justify-center bg-slate-900/30 border border-slate-800/50 rounded-xl text-slate-500 text-sm">
                    <span class="mb-1 text-slate-600 font-medium tracking-wide text-xs uppercase">Advertisement</span>
                    <span class="text-xs text-slate-700">(728x90 responsive reserved space)</span>
                </div>
            `;
        } else {
            // Production Ad Insertion
            container.innerHTML = `
                <div class="w-full min-h-[90px] flex justify-center items-center overflow-hidden">
                    <!-- SleepSync_Main_Banner -->
                    <ins class="adsbygoogle"
                         style="display:block; width: 100%;"
                         data-ad-client="${window.AppConfig.PUBLISHER_ID}"
                         data-ad-slot="${window.AppConfig.CONTENT_AD_SLOT}"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                </div>
            `;
            
            try {
                // Initialize the specific ad slot
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("[AdsManager] Failed to load AdSense", e);
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
