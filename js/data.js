window.SleepData = {
    sounds: [
        { id: 'rain', name: 'Rain', description: 'Soft rainfall', icon: '🌧️', file: 'rain.mp3' },
        { id: 'waves', name: 'Ocean', description: 'Calm ocean waves', icon: '🌊', file: 'beach.mp3' },
        { id: 'fire', name: 'Fireplace', description: 'Warm crackling fire', icon: '🔥', file: 'campfire.mp3' },
        { id: 'forest', name: 'Forest', description: 'Quiet forest ambience', icon: '🌲', file: 'forest.mp3' },
        { id: 'wind', name: 'Wind', description: 'Gentle howling wind', icon: '💨', file: 'wind.mp3' }
    ],
    presets: [
        { id: 'rainy_night', name: 'Rainy Night', icon: '🌧️', mix: { rain: 0.8, wind: 0.15 } },
        { id: 'cozy_fire', name: 'Cozy Fireplace', icon: '🔥', mix: { fire: 0.8, rain: 0.25 } },
        { id: 'forest_sleep', name: 'Forest Sleep', icon: '🌲', mix: { forest: 0.7, wind: 0.3 } },
        { id: 'ocean_breeze', name: 'Ocean Breeze', icon: '🌊', mix: { waves: 0.8, wind: 0.15 } }
    ]
};
