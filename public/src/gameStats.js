// gameStats.js

// Save the current game state to localStorage
export function saveGame() {
    const gameData = {
         cash: window.cash,
         cashPerClick: window.cashPerClick,
         totalMows: window.totalMows,
         lifetimeEarnings: window.lifetimeEarnings,
         upgrades: window.upgrades
    };
    localStorage.setItem('lawnCareClickerSave', JSON.stringify(gameData));
    alert("Game Saved!");
}

// Load the game state from localStorage (if available)
export function loadGame() {
    const saved = localStorage.getItem('lawnCareClickerSave');
    if (saved) {
         const gameData = JSON.parse(saved);
         window.cash = gameData.cash;
         window.cashPerClick = gameData.cashPerClick;
         window.totalMows = gameData.totalMows;
         window.lifetimeEarnings = gameData.lifetimeEarnings;
         window.upgrades = gameData.upgrades;
         // Update the UI elements after loading
         document.getElementById("cash-display").textContent = window.cash;
         document.getElementById("mow-count").textContent = window.totalMows;
         if (typeof renderUpgrades === "function") {
              renderUpgrades();
         }
         alert("Game Loaded!");
    }
}

// Reset the game (after confirmation) and clear saved data
export function resetGame() {
    if (confirm("Are you sure you want to reset the game? This cannot be undone.")) {
         localStorage.removeItem('lawnCareClickerSave');
         window.cash = 0;
         window.cashPerClick = 1;
         window.totalMows = 0;
         window.lifetimeEarnings = 0;
         window.upgrades = [
            { name: "Better Mower", baseCost: 10, cost: 10, effect: 1, count: 0 },
            { name: "Electric Mower", baseCost: 50, cost: 50, effect: 2, count: 0 },
            { name: "Riding Mower", baseCost: 200, cost: 200, effect: 5, count: 0 }
         ];
         document.getElementById("cash-display").textContent = window.cash;
         document.getElementById("mow-count").textContent = window.totalMows;
         if (typeof renderUpgrades === "function") {
              renderUpgrades();
         }
         alert("Game Reset!");
    }
}

// Set up event listeners for the settings modal buttons
window.addEventListener('DOMContentLoaded', () => {
    // Open settings modal when settings button is clicked
    document.querySelector('.settings-button').addEventListener('click', () => {
        document.getElementById('settings-modal').style.display = 'block';
    });

    // Close settings modal when close button is clicked
    document.getElementById('close-settings').addEventListener('click', () => {
        document.getElementById('settings-modal').style.display = 'none';
    });

    // Save game when save button is clicked
    document.getElementById('save-game').addEventListener('click', () => {
        saveGame();
    });

    // Reset game when reset button is clicked
    document.getElementById('reset-game').addEventListener('click', () => {
        resetGame();
    });

    // Optionally, load the game automatically on page load
    loadGame();
});
