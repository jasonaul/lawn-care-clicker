// public/src/gameStats.js

import { Game } from './game.js';
import { renderUpgrades } from './upgrades.js';
import { renderAchievements } from './achievements.js';
import { renderShop } from './shop.js';
import { renderBoosts } from './boosts.js';
import { getDefaultUpgrades } from './upgrades.js';
import { getDefaultAchievements } from './achievements.js';
import { getDefaultShopItems } from './shop.js';
import { getDefaultBoosts } from './boosts.js';

// Save the current game state to localStorage
export function saveGame() {
    const gameData = {
        cash: Game.cash,
        mows: Game.mows,
        mowsEarned: Game.mowsEarned,
        mowsPs: Game.mowsPs,
        mowsPsRaw: Game.mowsPsRaw,
        mowsPsRawHighest: Game.mowsPsRawHighest,
        mowClicks: Game.mowClicks,
        handmadeMows: Game.handmadeMows,
        prestigePoints: Game.prestigePoints,
        prestigeMultiplier: Game.prestigeMultiplier,
        prestigeResets: Game.prestigeResets,
        lifetimeEarnings: Game.lifetimeEarnings,
        BuildingsOwned: Game.BuildingsOwned,
        upgrades: Game.upgrades,
        achievements: Game.achievements,
        shopItems: Game.shopItems,
        boosts: Game.boosts,
        Objects: Object.keys(Game.Objects).reduce((obj, key) => {
            obj[key] = { amount: Game.Objects[key].amount, price: Game.Objects[key].price };
            return obj;
        }, {}),
        lastSaveTime: Date.now(),
    };
    localStorage.setItem("lawnCareClickerDeluxeSave", JSON.stringify(gameData));
    Game.notify("Game Saved!", 'success');
}

// Load the game state from localStorage (if available)
export function loadGame() {
    const saved = localStorage.getItem("lawnCareClickerDeluxeSave");
    if (saved) {
        const gameData = JSON.parse(saved);
        Game.cash = gameData.cash || 0;
        Game.mows = gameData.mows || 0;
        Game.mowsEarned = gameData.mowsEarned || 0;
        Game.mowsPs = gameData.mowsPs || 0;
        Game.mowsPsRaw = gameData.mowsPsRaw || 0;
        Game.mowsPsRawHighest = gameData.mowsPsRawHighest || 0;
        Game.mowClicks = gameData.mowClicks || 0;
        Game.handmadeMows = gameData.handmadeMows || 0;
        Game.prestigePoints = gameData.prestigePoints || 0;
        Game.prestigeMultiplier = gameData.prestigeMultiplier || 1;
        Game.prestigeResets = gameData.prestigeResets || 0;
        Game.lifetimeEarnings = gameData.lifetimeEarnings || 0;
        Game.BuildingsOwned = gameData.BuildingsOwned || 0;
        Game.upgrades = gameData.upgrades || getDefaultUpgrades();
        Game.achievements = gameData.achievements || getDefaultAchievements();
        Game.shopItems = gameData.shopItems || getDefaultShopItems();
        Game.boosts = gameData.boosts || getDefaultBoosts();
        Game.lastSaveTime = gameData.lastSaveTime || Date.now();

        // Restore building amounts and prices
        if (gameData.Objects) {
            for (const key in gameData.Objects) {
                if (Game.Objects.hasOwnProperty(key) && gameData.Objects.hasOwnProperty(key)) {
                    Game.Objects[key].amount = gameData.Objects[key].amount || 0;
                    Game.Objects[key].price = gameData.Objects[key].price || Game.Objects[key].basePrice;
                }
            }
        }

        Game.mowsPerClick = 1 * Game.prestigeMultiplier; // Re-calculate mowsPerClick based on prestige

        Game.UpdateCashDisplay();
        Game.UpdateMowCountDisplay();
        Game.UpdatePrestigePointDisplay();

        renderUpgrades();
        renderAchievements();
        renderShop();
        renderBoosts();
        Game.BuildStore(); // Rebuild the store to reflect loaded prices and amounts
        Game.CalculateGains(); // Recalculate gains after loading
        Game.notify("Game Loaded!", 'success');
    } else {
        Game.notify("No saved game found. Starting new game.", 'info');
    }
}

// Reset the game (after confirmation) and clear saved data
export function resetGame() {
    if (confirm("Are you sure you want to reset the game? This cannot be undone.")) {
        const prestigePoints = Game.prestigePoints;
        const prestigeResets = Game.prestigeResets;

        Game.ResetGame(); // Use the game's reset function to reset all values
        Game.prestigePoints = prestigePoints; // Keep prestige points
        Game.prestigeResets = prestigeResets; // Keep prestige resets count
        Game.prestigeMultiplier = 1 + (Game.prestigePoints * 0.01); // Re-apply prestige bonus

        localStorage.removeItem('lawnCareClickerDeluxeSave');

        Game.UpdatePrestigePointDisplay();
        Game.notify("Game Reset!", 'reset');
    }
}

// Set up event listeners for the settings modal buttons and prestige button
window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".settings-button").addEventListener("click", () => {
        document.getElementById("settings-modal").style.display = "block";
        document.getElementById("modal-overlay").style.display = "flex"; // For overlay
    });

    document.getElementById("close-settings").addEventListener("click", () => {
        document.getElementById("settings-modal").style.display = "none";
        document.getElementById("modal-overlay").style.display = "none"; // Hide overlay
    });

    document.getElementById("save-game").addEventListener("click", () => {
        saveGame();
    });

    document.getElementById("reset-game").addEventListener("click", () => {
        resetGame();
    });

    document.getElementById("prestige-button").addEventListener("click", () => {
        Game.Ascend();
    });


    // Optionally, load the game automatically on page load
    Game.Init(); // Initialize the game which includes loading game state
});