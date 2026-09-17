window.UI = (function() {
    function renderLibrary() {
        const soundLibrary = document.getElementById('sound-library');
        if (!soundLibrary) return;
        soundLibrary.innerHTML = '';
        
        // Render Ambient Sounds
        window.SleepData.sounds.forEach(sound => {
            const isActive = !!window.AudioEngine.getActiveSounds()[sound.id];
            
            const btn = document.createElement('button');
            btn.className = `btn-3d p-6 flex flex-col items-center justify-center w-full gap-4 ${isActive ? 'active' : ''}`;
            btn.onclick = () => {
                window.AudioEngine.toggleSound(sound.id, sound.file);
                btn.classList.toggle('active');
                renderMixer();
            };
            
            btn.innerHTML = `
                <span class="text-4xl drop-shadow-md">${sound.icon}</span>
                <div class="text-center">
                    <span class="block font-semibold text-slate-200 tracking-wide">${sound.name}</span>
                    <span class="block text-xs text-slate-400 mt-1">${sound.description}</span>
                </div>
            `;
            soundLibrary.appendChild(btn);
        });

        // Render Magic Card
        const magicIsActive = window.AudioEngine.getMagicState().isPlaying;
        const magicCard = document.createElement('button');
        magicCard.className = `btn-3d p-6 flex flex-col items-center justify-center w-full gap-4 border-fuchsia-900/50 ${magicIsActive ? 'active' : ''}`;
        magicCard.onclick = () => {
            window.AudioEngine.toggleMagic();
            magicCard.classList.toggle('active');
            renderMixer();
        };
        magicCard.innerHTML = `
            <span class="text-4xl drop-shadow-md">✨</span>
            <div class="text-center">
                <span class="block font-semibold text-fuchsia-300 tracking-wide">Magic</span>
                <span class="block text-xs text-fuchsia-400/70 mt-1">Romantic</span>
            </div>
        `;
        soundLibrary.appendChild(magicCard);
    }

    function renderMixer() {
        const activeMixer = document.getElementById('active-mixer');
        const mixerContainer = document.getElementById('mixer-container');
        if (!activeMixer || !mixerContainer) return;

        const activeNodes = window.AudioEngine.getActiveSounds();
        const activeIds = Object.keys(activeNodes);
        const magicState = window.AudioEngine.getMagicState();

        if (activeIds.length === 0 && !magicState.isPlaying) {
            mixerContainer.classList.add('hidden');
            return;
        }

        mixerContainer.classList.remove('hidden');
        activeMixer.innerHTML = '';

        // Render ambient sound rows
        Object.keys(activeNodes).forEach(id => {
            const sound = window.SleepData.sounds.find(s => s.id === id);
            if (!sound) return;

            const row = document.createElement('div');
            row.className = 'flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/50 shadow-inner mb-3';
            
            row.innerHTML = `
                <div class="text-3xl w-12 text-center drop-shadow-md">${sound.icon}</div>
                <div class="flex-1 w-full">
                    <div class="flex justify-between text-sm mb-3">
                        <span class="font-medium text-slate-200">${sound.name}</span>
                        <span class="text-slate-400 font-mono text-xs">${Math.round(activeNodes[id].targetVolume * 100)}%</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" value="${activeNodes[id].targetVolume}" 
                        class="slider-3d"
                        oninput="window.AudioEngine.setVolume('${id}', parseFloat(this.value)); window.UI.renderMixer();">
                </div>
                <button class="btn-3d p-3 text-slate-500 hover:text-red-400 transition-colors rounded-xl" onclick="window.AudioEngine.toggleSound('${id}', '${sound.file}'); window.UI.renderAll();" aria-label="Remove sound">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            `;
            activeMixer.appendChild(row);
        });

        // Render Magic music row
        if (magicState.isPlaying) {
            const row = document.createElement('div');
            row.className = 'flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-fuchsia-900/40 shadow-inner mb-3 relative overflow-hidden';
            
            row.innerHTML = `
                <div class="absolute inset-0 bg-fuchsia-900/10 blur-xl"></div>
                <div class="text-3xl w-12 text-center relative z-10 drop-shadow-md">✨</div>
                <div class="flex-1 w-full relative z-10">
                    <div class="flex justify-between text-sm mb-3">
                        <span class="font-semibold text-fuchsia-300">Magic Music (Track ${magicState.trackNum})</span>
                        <span class="text-fuchsia-400/70 font-mono text-xs">${Math.round(magicState.volume * 100)}%</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" value="${magicState.volume}" 
                        class="slider-3d"
                        oninput="window.AudioEngine.setMagicVolume(this.value); window.UI.renderMixer();">
                </div>
                <button class="btn-3d p-3 text-fuchsia-500/70 hover:text-red-400 transition-colors rounded-xl relative z-10" onclick="window.AudioEngine.toggleMagic(); window.UI.renderAll();" aria-label="Remove Magic">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            `;
            activeMixer.appendChild(row);
        }
    }

    function renderPresets() {
        const presetsContainer = document.getElementById('presets-list');
        if (!presetsContainer) return;
        presetsContainer.innerHTML = '';

        window.SleepData.presets.forEach(preset => {
            const btn = document.createElement('button');
            btn.className = "btn-3d flex items-center gap-4 p-4 text-left w-full";
            btn.onclick = () => window.Presets.loadPreset(preset.id);
            btn.innerHTML = `
                <span class="text-3xl drop-shadow-md">${preset.icon}</span>
                <span class="font-semibold text-slate-200 tracking-wide">${preset.name}</span>
            `;
            presetsContainer.appendChild(btn);
        });
    }

    function renderSavedMixes() {
        const container = document.getElementById('saved-mixes-list');
        if (!container) return;
        container.innerHTML = '';

        const mixes = window.Storage.getMixes();
        if (mixes.length === 0) {
            container.innerHTML = '<p class="text-slate-500/70 text-sm font-medium">Your saved mixes will appear here.</p>';
            return;
        }

        mixes.forEach(mix => {
            const row = document.createElement('div');
            row.className = 'btn-3d flex justify-between items-center p-4 mb-3 w-full';
            
            let soundNames = Object.keys(mix.mix).map(id => {
                const s = window.SleepData.sounds.find(x => x.id === id);
                return s ? s.name : id;
            });
            if (mix.magic) {
                soundNames.push("Magic Music");
            }

            row.innerHTML = `
                <div class="flex-1 cursor-pointer text-left" onclick="window.Storage.loadMix('${mix.id}')">
                    <h3 class="font-semibold text-slate-200 tracking-wide">${mix.name}</h3>
                    <p class="text-xs text-slate-400 mt-1 font-light">${soundNames.join(' ✨ ')}</p>
                </div>
                <button class="text-slate-500 hover:text-red-400 p-2 ml-4 rounded-lg bg-slate-900/50 shadow-inner" onclick="window.UI.handleDeleteMix('${mix.id}')" aria-label="Delete Mix">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            `;
            container.appendChild(row);
        });
    }

    function showTimerDisplay(show) {
        const display = document.getElementById('timer-display-container');
        const controls = document.getElementById('timer-controls');
        if (!display || !controls) return;

        if (show) {
            display.classList.remove('hidden');
            controls.classList.add('hidden');
        } else {
            display.classList.add('hidden');
            controls.classList.remove('hidden');
        }
    }

    function updateTimerDisplay(remainingMs) {
        const displayEl = document.getElementById('countdown-text');
        if (!displayEl) return;
        const mins = Math.floor(remainingMs / 60000);
        const secs = Math.floor((remainingMs % 60000) / 1000);
        displayEl.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateSleepModeBtn(isSleeping) {
        const btn = document.getElementById('btn-sleep-mode');
        if (!btn) return;
        btn.innerText = isSleeping ? 'Wake Up (Exit Sleep Mode)' : 'Enter Sleep Mode';
        if (isSleeping) {
            btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-500');
            btn.classList.remove('bg-slate-800', 'text-indigo-200');
        } else {
            btn.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-500');
            btn.classList.add('bg-slate-800', 'text-indigo-200');
        }
    }

    function handleCustomTimer() {
        const input = document.getElementById('custom-timer-input');
        if (input && input.value) {
            window.Timer.start(parseInt(input.value, 10));
        }
    }

    function handleSaveMix() {
        const name = prompt("Enter a name for your custom mix:", "My Sleep Mix");
        if (name) {
            if(window.Storage.saveCurrentMix(name)) {
                renderSavedMixes();
            }
        }
    }

    function handleDeleteMix(id) {
        if(confirm("Are you sure you want to delete this saved mix?")) {
            window.Storage.deleteMix(id);
            renderSavedMixes();
        }
    }

    function init() {
        const masterVol = document.getElementById('master-volume');
        if (masterVol) {
            masterVol.addEventListener('input', (e) => {
                window.AudioEngine.setMasterVolume(parseFloat(e.target.value));
            });
        }
        
        const saveBtn = document.getElementById('btn-save-mix');
        if (saveBtn) saveBtn.addEventListener('click', handleSaveMix);

        // Expose globally for HTML onclick events
        window.startTimer = window.Timer.start;
        window.stopTimer = window.Timer.stop;
        window.toggleSleepMode = window.Timer.toggleSleepMode;
        window.startCustomTimer = handleCustomTimer;

        renderAll();
    }

    function renderAll() {
        renderLibrary();
        renderMixer();
        renderPresets();
        renderSavedMixes();
    }

    return { 
        init, 
        renderAll, 
        renderMixer,
        showTimerDisplay,
        updateTimerDisplay,
        updateSleepModeBtn,
        handleDeleteMix
    };
})();
