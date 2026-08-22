window.UI = (function() {
    function renderLibrary() {
        const soundLibrary = document.getElementById('sound-library');
        if (!soundLibrary) return;
        soundLibrary.innerHTML = '';
        
        window.SleepData.sounds.forEach(sound => {
            const isActive = !!window.AudioEngine.getActiveSounds()[sound.id];
            
            const card = document.createElement('div');
            card.className = `p-4 rounded-2xl flex flex-col items-center cursor-pointer card-hover border-2 ${
                isActive ? 'bg-indigo-900/30 border-indigo-500 shadow-lg' : 'bg-slate-900 border-slate-800'
            }`;
            
            card.onclick = () => {
                window.AudioEngine.toggleSound(sound.id, sound.file);
                renderAll();
            };

            card.innerHTML = `
                <div class="text-4xl mb-3">${sound.icon}</div>
                <h3 class="font-medium text-slate-200">${sound.name}</h3>
                <p class="text-xs text-slate-400 text-center mt-1">${sound.description}</p>
            `;
            soundLibrary.appendChild(card);
        });
    }

    function renderMixer() {
        const activeMixer = document.getElementById('active-mixer');
        const activeContainer = document.getElementById('mixer-container');
        if (!activeMixer || !activeContainer) return;

        const active = window.AudioEngine.getActiveSounds();
        const activeIds = Object.keys(active);
        
        if (activeIds.length === 0) {
            activeContainer.classList.add('hidden');
            return;
        }

        activeContainer.classList.remove('hidden');
        activeMixer.innerHTML = '';

        activeIds.forEach(id => {
            const sound = window.SleepData.sounds.find(s => s.id === id);
            if (!sound) return;

            const currentVol = active[id].targetVolume;
            
            const row = document.createElement('div');
            row.className = 'flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800';
            
            row.innerHTML = `
                <div class="text-2xl w-10 text-center">${sound.icon}</div>
                <div class="flex-1">
                    <div class="flex justify-between text-sm mb-2">
                        <span class="font-medium text-indigo-200">${sound.name}</span>
                        <span class="text-slate-400">${Math.round(currentVol * 100)}%</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" value="${currentVol}" 
                        class="w-full accent-indigo-500"
                        oninput="window.AudioEngine.setVolume('${id}', parseFloat(this.value)); window.UI.renderMixer();">
                </div>
                <button class="text-slate-500 hover:text-red-400 p-2 ml-2 transition-colors" onclick="window.AudioEngine.toggleSound('${id}', '${sound.file}'); window.UI.renderAll();" aria-label="Remove sound">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            `;
            activeMixer.appendChild(row);
        });
    }

    function renderPresets() {
        const presetsContainer = document.getElementById('presets-list');
        if (!presetsContainer) return;
        presetsContainer.innerHTML = '';

        window.SleepData.presets.forEach(preset => {
            const btn = document.createElement('button');
            btn.className = "flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-indigo-900/30 transition-all text-left";
            btn.onclick = () => window.Presets.loadPreset(preset.id);
            btn.innerHTML = `
                <span class="text-2xl">${preset.icon}</span>
                <span class="font-medium text-slate-300">${preset.name}</span>
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
            container.innerHTML = '<p class="text-slate-500 text-sm">Your saved mixes will appear here.</p>';
            return;
        }

        mixes.forEach(mix => {
            const row = document.createElement('div');
            row.className = 'flex justify-between items-center p-3 mb-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 transition-all';
            
            const soundNames = Object.keys(mix.mix).map(id => {
                const s = window.SleepData.sounds.find(x => x.id === id);
                return s ? s.name : id;
            }).join(' • ');

            row.innerHTML = `
                <div class="flex-1 cursor-pointer" onclick="window.Storage.loadMix('${mix.id}')">
                    <h3 class="font-medium text-slate-200">${mix.name}</h3>
                    <p class="text-xs text-slate-500 mt-1">${soundNames}</p>
                </div>
                <button class="text-slate-500 hover:text-red-400 p-2 ml-4" onclick="window.UI.handleDeleteMix('${mix.id}')" aria-label="Delete Mix">
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
