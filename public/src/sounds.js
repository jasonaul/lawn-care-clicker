let clickSound;
let upgradeSound;

export function loadSounds() {
    clickSound = new Audio('/assets/sounds/click.mp3'); // Placeholder sound file
    upgradeSound = new Audio('/assets/sounds/upgrade.mp3'); // Placeholder upgrade sound
    clickSound.volume = 0.5; // Adjust volume as needed
    upgradeSound.volume = 0.5;
}

export function playClickSound() {
    if (clickSound) {
        clickSound.currentTime = 0; // Reset time to start to allow rapid clicks
        clickSound.play();
    }
}

export function playUpgradeSound() {
    if (upgradeSound) {
        upgradeSound.currentTime = 0;
        upgradeSound.play();
    }
}

// Initialize sounds on game start or when needed
loadSounds();