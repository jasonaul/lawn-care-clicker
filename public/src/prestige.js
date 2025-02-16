
import { Game } from './game.js';

// Execute a prestige reset – award prestige points and apply a multiplier bonus.
export function doPrestige() {
    Game.Ascend(); // Call the Ascend function in Game state to handle prestige logic
}

// Set up the prestige button listener
window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("prestige-button");
    btn.addEventListener("click", doPrestige);
});