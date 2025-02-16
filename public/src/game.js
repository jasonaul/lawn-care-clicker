import Phaser from 'phaser';
import { upgrades, getDefaultUpgrades, renderUpgrades, purchaseUpgrade } from './upgrades.js';
import { achievements, getDefaultAchievements, renderAchievements, checkAchievements } from './achievements.js';
import { shopItems, getDefaultShopItems, renderShop, purchaseShopItem } from './shop.js';
import { boosts, getDefaultBoosts, renderBoosts, purchaseBoost } from './boosts.js';
import { saveGame, loadGame, resetGame } from './gameStats.js';
import { playClickSound } from './sounds.js';
import { applyOfflineProgress } from './offlineProgress.js';

// --- Global Game State ---
export const Game = {
    version: '0.01',
    cash: 0,
    mows: 0,
    mowsEarned: 0,
    mowsPs: 0,
    mowsPsRaw: 0,
    mowsPsRawHighest: 0,
    mowClicks: 0,
    handmadeMows: 0,
    prestigePoints: 0,
    prestigeMultiplier: 1,
    prestigeResets: 0, // Track number of prestige resets
    lifetimeEarnings: 0,
    BuildingsOwned: 0,
    upgrades: getDefaultUpgrades(),
    achievements: getDefaultAchievements(),
    shopItems: getDefaultShopItems(),
    boosts: getDefaultBoosts(),
    Objects: {}, // Buildings are stored here
    ObjectsById: [],
    UpgradesById: [],
    fps: 30,
    gameLoopTimer: null,
    drawLoopTimer: null,
    T: 0,
    recalculateGains: 1,
    storeToRefresh: 1,
    buyMode: 1,
    buyBulk: 1,
    autoMowsPerSecond: 0,
    mowsPerClick: 1,
    tempMowsPerClickBonus: 0, // Temporary bonus from boosts
    tempMowsPerSecondMultiplier: 1, // Temporary multiplier from boosts
    tempGlobalMowsPerSecondMultiplier: 1, // Global MPS multiplier boosts

    Init: function() {
        console.log("Game.Init() called");
        this.mowsPerClick = 1 * this.prestigeMultiplier; // Apply prestige bonus to initial click power
        this.loadGame();
        this.applyOfflineProgress();
        this.DefineBuildings();
        this.BuildStore();
        this.BuildUpgradeStore();
        renderUpgrades();
        renderAchievements();
        renderShop();
        renderBoosts();
        this.CalculateGains();
        this.StartGameLoops();
        console.log("Game Initialized!");
    },

    StartGameLoops: function() {
        if (!this.gameLoopTimer) {
            this.gameLoopTimer = setInterval(() => this.Logic(), 1000 / this.fps);
        }
        if (!this.drawLoopTimer) {
            this.drawLoopTimer = setInterval(() => this.Draw(), 1000 / this.fps);
        }
    },

    StopGameLoops: function() {
        clearInterval(this.gameLoopTimer);
        clearInterval(this.drawLoopTimer);
        this.gameLoopTimer = null;
        this.drawLoopTimer = null;
    },

    Logic: function() {
        this.T++;
        if (this.T % this.fps === 0) {
            this.UnlockTieredUpgrades();
            this.CheckBoostVisibility();
            renderUpgrades();
            renderBoosts();
        }
        if (this.T % (this.fps / 2) === 0) // Adjust frequency as needed
        {
            this.CalculateGains();
            this.mows += (this.mowsPs / (this.fps / 2)) * this.tempGlobalMowsPerSecondMultiplier; // Apply global MPS multiplier
            this.mowsEarned += (this.mowsPs / (this.fps / 2)) * this.tempGlobalMowsPerSecondMultiplier;
            this.cash += (this.mowsPs / (this.fps / 2)) * this.tempGlobalMowsPerSecondMultiplier;
            this.lifetimeEarnings += (this.mowsPs / (this.fps / 2)) * this.tempGlobalMowsPerSecondMultiplier;
            this.UpdateCashDisplay();
            this.UpdateMowCountDisplay();
        }
    },

    Draw: function() {
        // Visual updates here if needed, currently handled by Phaser
    },

    DefineBuildings: function() {
        upgrades.filter(upg => upg.type === "building").forEach(buildingData => {
            this.Objects[buildingData.name] = buildingData;
            this.ObjectsById[buildingData.id] = buildingData;
            buildingData.amount = 0; // Initialize amount owned
            buildingData.baseCps = buildingData.cps(); // Store base CPS function
            buildingData.locked = buildingData.unlocked === 0; // Set initial lock state
            buildingData.price = buildingData.baseCost; // Initial price
            buildingData.basePrice = buildingData.baseCost; // Store base cost
            let me = this;
            buildingData.buy = function(){
                if (Game.cash >= this.price)
                {
                    Game.cash -= this.price;
                    this.amount++;
                    this.count++;
                    this.price = Math.ceil(this.baseCost * Math.pow(this.priceIncrease, this.amount)); // Price increases on purchase
                    Game.recalculateGains=1;
                    Game.BuildingsOwned++;
                    Game.storeToRefresh=1;
                    Game.BuildStore(); // Rebuild store to update prices and counts
                    if (this.buyFunction) this.buyFunction();
                    Game.notify(`Purchased ${this.name}!`, 'building');
                    renderUpgrades(); // Update upgrades in case new ones are unlocked
                    checkAchievements(); // Check for achievement updates
                } else {
                    Game.notify("Not enough cash to purchase!", 'warning');
                }
            };
        });
    },

    BuildStore: function() {
        const container = document.getElementById('products');
        if (!container) {
            console.error("Product container not found!");
            return;
        }
        container.innerHTML = ''; // Clear existing store items

        for (let i in this.Objects) {
            let building = this.Objects[i];
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.style.backgroundImage = `url('${building.image || '/assets/placeholder_building.png'}')`;

            const overlay = document.createElement("div");
            overlay.classList.add("product-text");
            overlay.innerHTML = `
                <div class="product-name">${building.name}</div>
                <div class="product-price">Cost: $${Beautify(building.price)}</div>
                <div class="product-owned">Owned: ${building.amount}</div>
            `;
            overlay.querySelector('.product-price').style.fontSize = '14px'; // Example of styling within
            overlay.querySelector('.product-owned').style.fontSize = '14px';

            productDiv.appendChild(overlay);

            productDiv.addEventListener('click', () => building.buy());
            container.appendChild(productDiv);
        }
    },

    BuildUpgradeStore: function() {
        this.UpgradesById = [];
        upgrades.forEach(upgrade => {
            if (upgrade.type !== "building") { // Only process non-building upgrades here
                this.UpgradesById[upgrade.id] = upgrade;
            }
        });
    },

    CalculateGains: function() {
        let baseMps = 0;
        for (let i in this.Objects) {
            let building = this.Objects[i];
            if (building.cps && typeof building.cps === 'function') {
                baseMps += building.cps() * building.amount; // Multiply by amount owned
            }
        }

        let prestigeBonus = this.prestigePoints * 0.01; // Prestige bonus calculation
        let multiplier = (1 + prestigeBonus) * this.tempMowsPerSecondMultiplier; // Apply prestige and MPS boost multipliers
        this.mowsPs = baseMps * multiplier;
        this.mowsPsRaw = baseMps;

        if (this.mowsPs > this.mowsPsRawHighest) {
            this.mowsPsRawHighest = this.mowsPs;
        }
        this.recalculateGains = 0;
    },

    UnlockTieredUpgrades: function() {
        for (let i in this.Objects) {
            let building = this.Objects[i];
            for (let j = 0; j < upgrades.length; j++) { // Use index for upgrades array
                let upgrade = upgrades[j];
                if (upgrade.buildingTie === building.name &&
                    building.amount >= upgrade.tier &&
                    !upgrade.unlocked)
                {
                    upgrade.unlocked = 1;
                    console.log("Unlocked upgrade:", upgrade.name);
                    this.notify(`${upgrade.name} Upgrade Unlocked!`, 'unlock');
                }
            }
        }
    },

    CheckBoostVisibility: function() {
        boosts.forEach(boost => {
            if (!boost.isVisible) {
                if (boost.unlocked && boost.unlocked <= this.BuildingsOwned) { // Example unlock condition
                    boost.isVisible = true;
                    renderBoosts(); // Re-render boosts to show new ones
                }
            }
        });
    },

    mowLawn: function(scene) {
        this.cash += (this.mowsPerClick + this.tempMowsPerClickBonus) * this.prestigeMultiplier; // Apply prestige and click boost to cash
        this.mows++;
        this.mowsEarned += (this.mowsPerClick + this.tempMowsPerClickBonus) * this.prestigeMultiplier;
        this.lifetimeEarnings += (this.mowsPerClick + this.tempMowsPerClickBonus) * this.prestigeMultiplier;
        this.mowClicks++;
        this.UpdateCashDisplay();
        this.UpdateMowCountDisplay();
        checkAchievements();
        playClickSound(); // Play sound effect on click
        this.spawnClickEffect(scene); // Visual click effect
    },

    spawnClickEffect: function(scene) {
        const lawnRect = scene.lawn; // Assuming 'lawn' is your Phaser rectangle
        const worldPoint = scene.input.activePointer.positionToCamera(scene.cameras.main);
        const clickText = scene.add.text(worldPoint.x, worldPoint.y, `+$${(this.mowsPerClick * this.prestigeMultiplier).toFixed(0)}`, {
            fontSize: '20px',
            color: '#ffcc00',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);
        scene.tweens.add({
            targets: clickText,
            y: worldPoint.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                clickText.destroy();
            }
        });
    },

    UpdateCashDisplay: function() {
        document.getElementById("cash-display").textContent = Beautify(this.cash);
    },

    UpdateMowCountDisplay: function() {
        document.getElementById("mow-count").textContent = Beautify(this.mows);
    },
    UpdatePrestigePointDisplay: function() {
        document.getElementById("prestige-points").textContent = Beautify(this.prestigePoints);
    },

    HowMuchPrestige: function(mows) {
        return Math.sqrt(mows/1000000000000); // Example formula, adjust as needed
    },

    Ascend: function() {
        const prestigeGain = Math.floor(this.HowMuchPrestige(this.lifetimeEarnings));
        if (prestigeGain <= this.prestigePoints) {
            alert("Not enough lifetime earnings to gain prestige.");
            return;
        }

        if (confirm(`Prestiging will reset your game but grant you ${prestigeGain - this.prestigePoints} prestige points. Are you sure?`)) {
            this.prestigeResets++; // Increment prestige reset count
            this.prestigePoints = prestigeGain;
            this.prestigeMultiplier = 1 + (this.prestigePoints * 0.01); // Example 1% bonus per point
            this.ResetGame(true); // Reset all game progress, keep prestige
            this.UpdatePrestigePointDisplay();
            this.notify(`Prestige Reset! +${prestigeGain - this.prestigePoints} Prestige Points`, 'prestige');
        }
    },

    ResetGame: function(prestigeReset = false) {
        this.StopGameLoops(); // Stop game loops before reset
        this.cash = 0;
        this.mows = 0;
        this.mowsEarned = 0;
        this.mowsPs = 0;
        this.mowsPsRaw = 0;
        this.mowsPsRawHighest = 0;
        this.mowClicks = 0;
        this.handmadeMows = 0;
        this.BuildingsOwned = 0;
        this.T = 0;
        this.recalculateGains = 1;
        this.storeToRefresh = 1;
        this.autoMowsPerSecond = 0;
        this.mowsPerClick = 1 * this.prestigeMultiplier; // Re-apply prestige multiplier
        this.tempMowsPerClickBonus = 0;
        this.tempMowsPerSecondMultiplier = 1;
        this.tempGlobalMowsPerSecondMultiplier = 1;

        this.upgrades = getDefaultUpgrades(); // Reset upgrades to default
        this.achievements = getDefaultAchievements(); // Reset achievements
        this.boosts = getDefaultBoosts(); // Reset boosts
        for (let buildingName in this.Objects) {
            this.Objects[buildingName].amount = 0; // Reset building amounts
            this.Objects[buildingName].price = this.Objects[buildingName].basePrice; // Reset building prices
        }

        renderUpgrades();
        renderAchievements();
        renderBoosts();
        this.BuildStore();
        this.UpdateCashDisplay();
        this.UpdateMowCountDisplay();

        if (!prestigeReset) {
            this.prestigePoints = 0; // Only reset prestige points if not a prestige reset
            this.prestigeMultiplier = 1;
            this.UpdatePrestigePointDisplay();
            this.prestigeResets = 0;
        }

        this.StartGameLoops(); // Restart game loops after reset
        this.saveGame(); // Immediately save the reset state
    },

    saveGame: saveGame,
    loadGame: loadGame,
    resetGame: resetGame,
    applyOfflineProgress: applyOfflineProgress,

    notify: function(message, type = 'info', duration = 3000) {
        const notificationArea = document.getElementById('notification-area') || this.createNotificationArea();
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.innerHTML = message;
        notificationArea.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('notification-fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500); // Fade out animation duration
        }, duration);
    },

    createNotificationArea: function() {
        let area = document.createElement('div');
        area.id = 'notification-area';
        document.body.appendChild(area);
        return area;
    },
};

// Helper function to beautify numbers
function Beautify(val) {
    var notations = ['', 'k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'ODc', 'NDc'];
    var notation = '';
    var base = 0;
    if (!isFinite(val)) return 'Infinity';
    if (val >= 1000) {
        val /= 1000;
        while (Math.round(val) >= 1000) {
            val /= 1000;
            base++;
        }
        if (base >= notations.length) {
            return 'Infinity';
        } else {
            notation = notations[base];
        }
    }
    return (Math.round(val * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + notation;
}

export { Beautify };

