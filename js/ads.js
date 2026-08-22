window.AdsManager = (function() {
    function init() {
        const container = document.getElementById('ad-container-main');
        if (!container) return;

        if (!window.AppConfig.ADS_ENABLED) {
            // Development Placeholder
            // Reserved dimensions to prevent Layout Shift (CLS)
            container.innerHTML = `
                <div class="w-full min-h-[90px] max-w-[728px] mx-auto flex flex-col items-center justify-center bg-slate-900/30 border border-slate-800/50 rounded-xl text-slate-500 text-sm">
                    <span class="mb-1 text-slate-600 font-medium tracking-wide text-xs uppercase">Advertisement</span>
                    <span class="text-xs text-slate-700">(728x90 responsive reserved space)</span>
                </div>
            `;
        } else {
            // Production AdSense Insertion
            // Ensure min-height is still reserved while loading to prevent layout shift
            container.innerHTML = `
                <div class="w-full min-h-[90px] flex justify-center items-center ad-production-slot overflow-hidden relative">
                    <!-- SleepSync_Main_Banner -->
                    <ins class="adsbygoogle"
                         style="display:block; width: 100%;"
                         data-ad-client="${window.AppConfig.PUBLISHER_ID}"
                         data-ad-slot="${window.AppConfig.CONTENT_AD_SLOT}"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                </div>
            `;
            loadAdProvider();
        }
    }

    function loadAdProvider() {
        if (window.AppConfig.ADS_PROVIDER === 'adsense') {
            try {
                // 1. Inject the Google AdSense script dynamically into the <head> 
                // (using innerHTML for scripts doesn't execute them, so we create an element)
                if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
                    const script = document.createElement('script');
                    script.async = true;
                    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${window.AppConfig.PUBLISHER_ID}`;
                    script.crossOrigin = "anonymous";
                    document.head.appendChild(script);
                }
                
                // 2. Initialize the specific ad slot
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                
                console.log(`[AdsManager] Injected AdSense banner ${window.AppConfig.CONTENT_AD_SLOT}`);
            } catch (e) {
                console.error("[AdsManager] Failed to load AdSense", e);
            }
        }
    }

    return { init };
})();
