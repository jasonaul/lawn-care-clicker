// public/src/upgrades.js
import { Game } from './game.js';
import { playUpgradeSound } from './sounds.js';
import { checkAchievements } from './achievements.js';
import { Beautify } from './game.js'; // Import Beautify function

export const upgrades = [
    // Click Upgrades
    {
        id: 0,
        name: "Better Mower",
        type: "click",
        baseCost: 10,
        cost: 10,
        mowsPerClick: 1,
        count: 0,
        priceIncrease: 1.15,
        image: "/assets/upgrades/better_mower.png",
        unlocked: 1,
        buildingTie: null,
        tier: 0,
    },
    {
        id: 1,
        name: "Electric Mower",
        type: "click",
        baseCost: 50,
        cost: 50,
        mowsPerClick: 2,
        count: 0,
        priceIncrease: 1.15,
        image: "/assets/upgrades/electric_mower.png",
        unlocked: 0,
        tier: 0,
        buildingTie: null,
        unlockCondition: () => Game.mowClicks >= 50,
    },
    {
        id: 2,
        name: "Riding Mower",
        type: "click",
        baseCost: 200,
        cost: 200,
        mowsPerClick: 5,
        count: 0,
        priceIncrease: 1.15,
        image: "/assets/upgrades/riding_mower.png",
        unlocked: 0,
        tier: 0,
        buildingTie: null,
        unlockCondition: () => Game.mowClicks >= 200,
    },
    {
        id: 3,
        name: "Turbocharged Clippers",
        type: "click",
        baseCost: 1000,
        cost: 1000,
        mowsPerClick: 10,
        count: 0,
        priceIncrease: 1.2,
        image: "/assets/upgrades/turbo_clippers.png", // Placeholder
        unlocked: 0,
        tier: 0,
        buildingTie: null,
        unlockCondition: () => Game.mowClicks >= 1000,
    },
    // Buildings
    {
        id: 3,
        name: "Employee",
        type: "building",
        baseCost: 500,
        cost: 500,
        baseBlades: 1,
        cps: function() { return this.baseBlades * this.amount; },
        count: 0,
        amount: 0,
        priceIncrease: 1.15,
        image: "/assets/upgrades/employee.png",
        unlocked: 1,
        buildingTie: null,
        tier: 0,
    },
    {
        id: 4,
        name: "Precision Pruners",
        type: "building",
        baseCost: 2500,
        cost: 2500,
        baseBlades: 5,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.25,
        image: "/assets/upgrades/precision_pruners.png",
        unlocked: 1,
        tier: 0,
        buildingTie: null,
    },
    {
        id: 5,
        name: "Lawn Llama",
        type: "building",
        baseCost: 10000,
        cost: 10000,
        baseBlades: 15,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.25,
        image: "/assets/upgrades/lawn_llama.png",
        unlocked: 1,
        tier: 0,
        buildingTie: null,
    },
    {
        id: 6,
        name: "Grass Guru",
        type: "building",
        baseCost: 50000,
        cost: 50000,
        baseBlades: 50,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.3,
        image: "/assets/upgrades/grass_guru.png",
        unlocked: 1,
        tier: 0,
        buildingTie: null,
    },
    {
        id: 7,
        name: "Sod Slayer",
        type: "building",
        baseCost: 200000,
        cost: 200000,
        baseBlades: 150,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.3,
        image: "/assets/upgrades/sod_slayer.png",
        unlocked: 1,
        tier: 0,
        buildingTie: null,
    },
    {
        id: 8,
        name: "Turbo Trimmer",
        type: "building",
        baseCost: 1000000,
        cost: 1000000,
        baseBlades: 500,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.35,
        image: "/assets/upgrades/turbo_trimmer.png",
        unlocked: 1,
        tier: 0,
        buildingTie: null,
    },
    {
        id: 9,
        name: "Orbiting Overseer",
        type: "building",
        baseCost: 5000000,
        cost: 5000000,
        baseBlades: 2000,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.35,
        image: "/assets/upgrades/orbiting_overseer.png",
        unlocked: 1,
        tier: 0,
        buildingTie: null,
    },
    {
        id: 10,
        name: "Mega Mulcher",
        type: "building",
        baseCost: 25000000,
        cost: 25000000,
        baseBlades: 10000,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.4,
        image: "/assets/upgrades/mega_mulcher.png",
        unlocked: 1,
        tier: 0,
        buildingTie: null,
    },
    {
        id: 11,
        name: "Hyper Horticulturist",
        type: "building",
        baseCost: 100000000,
        cost: 100000000,
        baseBlades: 50000,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.4,
        image: "/assets/upgrades/hyper_horticulturist.png",
        unlocked: 1,
        tier: 0,
        buildingTie: null,
    },
    {
        id: 12,
        name: "Quantum Quencher",
        type: "building",
        baseCost: 500000000,
        cost: 500000000,
        baseBlades: 250000,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.45,
        image: "/assets/upgrades/quantum_quencher.png",
        unlocked: 1,
        tier: 0,
        buildingTie: null,
    },
    {
        id: 13,
        name: "Cosmic Cultivator",
        type: "building",
        baseCost: 2500000000,
        cost: 2500000000,
        baseBlades: 1000000,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.45,
        image: "/assets/upgrades/cosmic_cultivator.png",
        unlocked: 1,
        tier: 0,
        buildingTie: null,
    },
    // New Buildings Below:
    {
        id: 18,
        name: "Robo Mower",
        type: "building",
        baseCost: 10000000000,
        cost: 10000000000,
        baseBlades: 5000000,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.5,
        image: "/assets/upgrades/robo_mower.png", // Placeholder
        unlocked: 1,
        tier: 0,
        buildingTie: null,
    },
    {
        id: 19,
        name: "Drone Sprinkler",
        type: "building",
        baseCost: 50000000000,
        cost: 50000000000,
        baseBlades: 25000000,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.5,
        image: "/assets/upgrades/drone_sprinkler.png", // Placeholder
        unlocked: 0, // Start locked, unlock condition can be added later
        tier: 0,
        buildingTie: null,
        unlockCondition: () => Game.Objects['Robo Mower'] && Game.Objects['Robo Mower'].amount >= 10, // Example unlock condition
    },
    {
        id: 20,
        name: "Hedgehog Army",
        type: "building",
        baseCost: 250000000000,
        cost: 250000000000,
        baseBlades: 100000000,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.55,
        image: "/assets/upgrades/hedgehog_army.png", // Placeholder
        unlocked: 0,
        tier: 0,
        buildingTie: null,
        unlockCondition: () => Game.Objects['Drone Sprinkler'] && Game.Objects['Drone Sprinkler'].amount >= 10,
    },
    {
        id: 21,
        name: "Genetically Modified Grass",
        type: "building",
        baseCost: 1000000000000,
        cost: 1000000000000,
        baseBlades: 500000000,
        cps: function(){return this.baseBlades * this.amount;},
        count: 0,
        amount: 0,
        priceIncrease: 1.55,
        image: "/assets/upgrades/genetically_modified_grass.png", // Placeholder
        unlocked: 0,
        tier: 0,
        buildingTie: null,
        unlockCondition: () => Game.Objects['Hedgehog Army'] && Game.Objects['Hedgehog Army'].amount >= 10,
    },
    // Building Tiered Upgrades - Employee
    {
        id: 14,
        name: "Employee Training",
        type: "upgrade",
        baseCost: 1000,
        cost: 1000,
        buildingTie: "Employee",
        tier: 1,
        unlocked: 0,
        priceIncrease: 1.5,
        mpsMultiplier: 2,
        image: "/assets/upgrades/employee_training.png",
        count: 0,
        desc: "Employees are twice as efficient.",
        unlockCondition: () => Game.Objects['Employee'] && Game.Objects['Employee'].amount >= 1,
        applyEffect: function() {
            if (Game.Objects['Employee']) {
                Game.Objects['Employee'].baseBlades *= this.mpsMultiplier;
                Game.Objects['Employee'].baseCps = Game.Objects['Employee'].cps();
                Game.recalculateGains = 1;
            }
        }
    },
    {
        id: 15,
        name: "Employee Motivation",
        type: "upgrade",
        baseCost: 5000,
        cost: 5000,
        buildingTie: "Employee",
        tier: 10,
        unlocked: 0,
        priceIncrease: 1.6,
        mpsMultiplier: 2.5,
        image: "/assets/upgrades/employee_motivation.png",
        count: 0,
        desc: "Employees are 2.5x more efficient.",
        unlockCondition: () => Game.Objects['Employee'] && Game.Objects['Employee'].amount >= 10,
        applyEffect: function() {
            if (Game.Objects['Employee']) {
                Game.Objects['Employee'].baseBlades *= this.mpsMultiplier;
                Game.Objects['Employee'].baseCps = Game.Objects['Employee'].cps();
                Game.recalculateGains = 1;
            }
        }
    },
    // Building Tiered Upgrades - Precision Pruners
    {
        id: 16,
        name: "Pruning Shears Sharpening",
        type: "upgrade",
        baseCost: 7500,
        cost: 7500,
        buildingTie: "Precision Pruners",
        tier: 5,
        unlocked: 0,
        priceIncrease: 1.55,
        mpsMultiplier: 2,
        image: "/assets/upgrades/pruning_shears_sharpening.png", // Placeholder
        count: 0,
        desc: "Precision Pruners are twice as efficient.",
        unlockCondition: () => Game.Objects['Precision Pruners'] && Game.Objects['Precision Pruners'].amount >= 5,
        applyEffect: function() {
            if (Game.Objects['Precision Pruners']) {
                Game.Objects['Precision Pruners'].baseBlades *= this.mpsMultiplier;
                Game.Objects['Precision Pruners'].baseCps = Game.Objects['Precision Pruners'].cps();
                Game.recalculateGains = 1;
            }
        }
    },
     // Building Tiered Upgrades - Lawn Llama
    {
        id: 17,
        name: "Llama Feed Optimization",
        type: "upgrade",
        baseCost: 50000,
        cost: 50000,
        buildingTie: "Lawn Llama",
        tier: 5,
        unlocked: 0,
        priceIncrease: 1.6,
        mpsMultiplier: 2,
        image: "/assets/upgrades/llama_feed_optimization.png", // Placeholder
        count: 0,
        desc: "Lawn Llamas are twice as efficient.",
        unlockCondition: () => Game.Objects['Lawn Llama'] && Game.Objects['Lawn Llama'].amount >= 5,
        applyEffect: function() {
            if (Game.Objects['Lawn Llama']) {
                Game.Objects['Lawn Llama'].baseBlades *= this.mpsMultiplier;
                Game.Objects['Lawn Llama'].baseCps = Game.Objects['Lawn Llama'].cps();
                Game.recalculateGains = 1;
            }
        }
    },
    // Example Prestige Upgrade (Not yet functional in prestige system)
    {
        id: 99, // High ID to differentiate from regular upgrades
        name: "Prestige Power I",
        type: "prestige", // Mark as prestige upgrade
        baseCost: 10, // Prestige point cost
        cost: 10,
        prestigeBonusIncrease: 0.01, // Increase prestige bonus by 1%
        count: 0,
        priceIncrease: 1.5,
        image: "/assets/upgrades/prestige_power_1.png", // Placeholder
        unlocked: 1, // Prestige upgrades might be always available in prestige store
        desc: "Increases prestige bonus by 1% per level.",
        applyEffect: function() {
            Game.prestigeMultiplier += this.prestigeBonusIncrease; // Directly increase prestige multiplier
            Game.recalculateGains = 1;
        },
        isVisible: false // Initially not visible, will be shown in prestige store
    },
    // ... more upgrades ...
];

export function getDefaultUpgrades() {
    return upgrades.map(upgrade => ({ ...upgrade, count: 0, unlocked: upgrade.id < 3 ? 1 : 0 }));
}

export function renderUpgrades() {
    const container = document.getElementById("upgrade-list");
    if (!container) {
        console.error("Upgrade container not found!");
        return;
    }
    container.innerHTML = "";

    upgrades.forEach((upgrade, index) => {
        if (upgrade.unlocked && upgrade.type !== "building" && upgrade.type !== "prestige") { // Exclude 'building' and 'prestige' types
            const btn = document.createElement("div");
            btn.classList.add("upgrade-button");
            btn.style.backgroundImage = `url('${upgrade.image || '/assets/placeholder_upgrade.png'}')`;

            const overlay = document.createElement("div");
            overlay.classList.add("upgrade-text");
            overlay.innerHTML = `
                <div class="upgrade-title">${upgrade.name}</div>
                <div class="upgrade-info">Cost: $${Beautify(upgrade.cost)}</div>
                <div class="upgrade-info">Owned: ${upgrade.count}</div>
            `;
            btn.appendChild(overlay);

            btn.addEventListener("click", () => purchaseUpgrade(index));
            container.appendChild(btn);
        }
    });
}

export function purchaseUpgrade(index) {
    const upgrade = upgrades[index];
    if (!upgrade) return;

    if (Game.cash >= upgrade.cost) {
        Game.cash -= upgrade.cost;
        upgrade.count++;
        upgrade.cost = Math.ceil(upgrade.baseCost * Math.pow(upgrade.priceIncrease, upgrade.count));

        if (upgrade.type === 'click') {
            Game.mowsPerClick += upgrade.mowsPerClick;
        } else if (upgrade.type === 'upgrade' && upgrade.applyEffect) {
            upgrade.applyEffect();
        }

        renderUpgrades();
        playUpgradeSound();
        Game.notify(`Purchased ${upgrade.name}!`, 'upgrade');
        checkAchievements();
        Game.recalculateGains = 1;
        Game.storeToRefresh = 1;
        Game.BuildStore();
    } else {
        Game.notify("Not enough cash to purchase upgrade!", 'warning');
    }
}

// Function to check and unlock upgrades based on conditions
export function checkUpgradeUnlocks() {
    upgrades.forEach(upgrade => {
        if (!upgrade.unlocked && upgrade.type !== "prestige" && upgrade.unlockCondition && upgrade.unlockCondition()) { // Exclude prestige upgrades from regular unlocks
            upgrade.unlocked = 1;
            renderUpgrades();
            Game.notify(`${upgrade.name} Upgrade Unlocked!`, 'unlock');
        }
    });
}

// Call checkUpgradeUnlocks periodically in your game loop (e.g., every second)
setInterval(checkUpgradeUnlocks, 1000);