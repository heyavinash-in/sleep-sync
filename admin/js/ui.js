window.AdminUI = (function() {

    function renderSounds() {
        const draft = window.AdminDB.getDraft();
        const tbody = document.getElementById('sounds-table-body');
        if (!tbody || !draft) return;

        tbody.innerHTML = '';
        const sounds = (draft.sounds || []).sort((a,b) => a.order - b.order);

        sounds.forEach(sound => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">${sound.icon}</span>
                        <span class="font-medium text-slate-200">${sound.name}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-slate-400 truncate max-w-xs">${sound.description}</td>
                <td class="px-6 py-4 text-slate-500 font-mono text-xs">${sound.file}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded text-xs font-medium ${sound.enabled ? 'bg-emerald-900/30 text-emerald-400' : 'bg-slate-800 text-slate-500'}">
                        ${sound.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <button class="text-indigo-400 hover:text-indigo-300 mr-3 text-sm">Edit</button>
                    <button class="text-slate-500 hover:text-red-400 text-sm">Disable</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderPresets() {
        const draft = window.AdminDB.getDraft();
        const grid = document.getElementById('presets-grid');
        if (!grid || !draft) return;

        grid.innerHTML = '';
        const presets = (draft.presets || []).sort((a,b) => a.order - b.order);

        presets.forEach(preset => {
            const card = document.createElement('div');
            card.className = "bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col";
            
            const mixKeys = Object.keys(preset.mix);
            
            card.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">${preset.icon}</span>
                        <h3 class="font-medium text-slate-200">${preset.name}</h3>
                    </div>
                    <button class="text-slate-500 hover:text-indigo-400 text-sm">Edit</button>
                </div>
                <div class="flex-1">
                    <p class="text-xs text-slate-400 mb-2">Mix Details:</p>
                    <div class="flex flex-wrap gap-2">
                        ${mixKeys.map(k => `<span class="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">${k} (${Math.round(preset.mix[k]*100)}%)</span>`).join('')}
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function renderLayout() {
        const draft = window.AdminDB.getDraft();
        const list = document.getElementById('layout-list');
        if (!list || !draft) return;

        list.innerHTML = '';
        const layout = (draft.layout || []).sort((a,b) => a.order - b.order);

        layout.forEach((section, index) => {
            const item = document.createElement('div');
            item.className = "flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg";
            item.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="text-slate-500 cursor-move text-lg">☰</div>
                    <span class="font-medium ${section.enabled ? 'text-slate-200' : 'text-slate-500 line-through'}">${section.name}</span>
                </div>
                <div class="flex items-center gap-2">
                    <button class="p-1 text-slate-500 hover:text-indigo-400" onclick="window.AdminUI.moveLayoutItem(${index}, -1)">▲</button>
                    <button class="p-1 text-slate-500 hover:text-indigo-400" onclick="window.AdminUI.moveLayoutItem(${index}, 1)">▼</button>
                    <label class="ml-3 flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" ${section.enabled ? 'checked' : ''} onchange="window.AdminUI.toggleLayoutItem('${section.id}')">
                        <div class="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative"></div>
                    </label>
                </div>
            `;
            list.appendChild(item);
        });
    }

    function moveLayoutItem(index, direction) {
        const draft = window.AdminDB.getDraft();
        const layout = draft.layout;
        if (index + direction < 0 || index + direction >= layout.length) return;

        // Swap orders
        const temp = layout[index].order;
        layout[index].order = layout[index + direction].order;
        layout[index + direction].order = temp;
        
        window.AdminDB.markModified();
        renderLayout();
    }

    function toggleLayoutItem(id) {
        const draft = window.AdminDB.getDraft();
        const item = draft.layout.find(l => l.id === id);
        if (item) {
            item.enabled = !item.enabled;
            window.AdminDB.markModified();
            renderLayout();
        }
    }

    function renderSettings() {
        const draft = window.AdminDB.getDraft();
        const titleInput = document.getElementById('setting-title');
        const descInput = document.getElementById('setting-desc');
        
        if (titleInput && draft.settings) {
            titleInput.value = draft.settings.title || '';
            titleInput.oninput = (e) => { draft.settings.title = e.target.value; window.AdminDB.markModified(); };
        }
        if (descInput && draft.settings) {
            descInput.value = draft.settings.description || '';
            descInput.oninput = (e) => { draft.settings.description = e.target.value; window.AdminDB.markModified(); };
        }
    }

    return {
        renderSounds,
        renderPresets,
        renderLayout,
        renderSettings,
        moveLayoutItem,
        toggleLayoutItem,
        openSoundModal: () => alert('Sound modal UI placeholder'),
        openPresetModal: () => alert('Preset modal UI placeholder')
    };
})();
