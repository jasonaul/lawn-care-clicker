import { Beautify } from './game.js';
 import { Game } from './game.js';

export function applyOfflineProgress() {
    const lastSaveTime = Game.lastSaveTime;
    if (!lastSaveTime) return; // No last save time, so no offline progress to apply

    const now = Date.now();
    const offlineTimeSeconds = Math.max(0, (now - lastSaveTime) / 1000); // Ensure non-negative

    if (offlineTimeSeconds > 3600 * 24 * 7) { // Limit offline progress to 7 days (example)
        console.log("Offline time exceeded 7 days, capping progress.");
        return; // Cap offline progress to a reasonable amount of time
    }

    const offlineMows = Game.mowsPs * offlineTimeSeconds * Game.tempGlobalMowsPerSecondMultiplier; // Apply MPS for offline time, include global MPS boost
    const offlineCash = offlineMows; // Assuming 1 mow = $1, adjust if needed

    if (offlineMows > 0) {
        Game.mows += offlineMows;
        Game.mowsEarned += offlineMows;
        Game.cash += offlineCash;
        Game.lifetimeEarnings += offlineCash;

        Game.UpdateCashDisplay();
        Game.UpdateMowCountDisplay();
        Game.saveGame(); // Save progress after applying offline gains

        const offlineHours = Math.floor(offlineTimeSeconds / 3600);
        const offlineMinutes = Math.floor((offlineTimeSeconds % 3600) / 60);
        const offlineSeconds = Math.floor(offlineTimeSeconds % 60);

        let offlineMessage = `Welcome back! While you were away for ${offlineHours}h ${offlineMinutes}m ${offlineSeconds}s, your employees mowed the lawn and earned you ${Beautify(offlineCash, true)} and ${Beautify(offlineMows)} mows.`; // isCash true for cash
        Game.notify(offlineMessage, 'offline', 5000); // Show longer notification for offline progress
        console.log("Applied offline progress:", offlineMessage);
    }
}

// function Beautify(val) { // Re-use the Beautify function from game.js or import if modularized
//     var notations = ['', 'k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'ODc', 'NDc'];
//     var notation = '';
//     var base = 0;
//     if (!isFinite(val)) return 'Infinity';
//     if (val >= 1000) {
//         val /= 1000;
//         while (Math.round(val) >= 1000) {
//             val /= 1000;
//             base++;
//         }
//         if (base >= notations.length) {
//             return 'Infinity';
//         } else {
//             notation = notations[base];
//         }
//     }
//     return (Math.round(val * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + notation;
// }