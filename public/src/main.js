import Phaser from 'phaser';

// ✅ Destroy previous Phaser instance before creating a new one
function destroyPreviousGame() {
    if (window.phaserGame) {
        window.phaserGame.destroy(true);
        window.phaserGame = null;
    }
}

// ✅ Define Phaser game configuration
const config = {
    type: Phaser.AUTO,
    parent: 'lawn-container',  // ✅ Attach ONLY to the lawn area
    scale: {
        mode: Phaser.Scale.RESIZE,  // ✅ Allows dynamic resizing
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#36d700', // ✅ Make entire middle panel green
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// ✅ Ensure Phaser only initializes once
if (!window.phaserGame) {
    destroyPreviousGame();
    window.phaserGame = new Phaser.Game(config);
}

// Game variables
let cash = 0;
let cashPerClick = 1;
let totalMows = 0;
let lifetimeEarnings = 0;
let cashText, totalMowsText, lifetimeEarningsText;
let lawn;

// Upgrade List with Scaling Costs
window.upgrades = [
    { name: "Better Mower", baseCost: 10, cost: 10, effect: 1, count: 0 },
    { name: "Electric Mower", baseCost: 50, cost: 50, effect: 2, count: 0 },
    { name: "Riding Mower", baseCost: 200, cost: 200, effect: 5, count: 0 }
];


let upgradeButtons = [];

function preload() {
    console.log("Preloading assets...");
}

function create() {
    console.log("Game scene created!");

    let width = this.scale.width;
    let height = this.scale.height;

    // ✅ Create the lawn area (smaller inside the middle panel)
    lawn = this.add.rectangle(width / 2, height / 2, width * 0.6, height * 0.6, 0x228B22)
        .setInteractive()
        .on('pointerdown', () => mowLawn(this));

    // ✅ Move the "Click to Mow!" text inside the clickable lawn
    this.add.text(width / 2, height / 2, "🚜 Click to Mow!", { 
        fontSize: '24px', 
        fill: '#fff' 
    }).setOrigin(0.5);

    document.addEventListener("DOMContentLoaded", () => {
        renderUpgrades(); // Ensure upgrades render after the page fully loads
    });
    

    // ✅ Render upgrades correctly
    renderUpgrades();
}

function update() {
    document.getElementById("cash-display").textContent = cash;
    document.getElementById("mow-count").textContent = totalMows;

    if (!upgradeButtons || upgradeButtons.length === 0) return;

    // ✅ Update upgrade buttons dynamically
    upgradeButtons.forEach((button, index) => {
        let upgrade = upgrades[index];
        if (upgrade) {
            button.innerText = getUpgradeText(upgrade);
            button.style.opacity = cash >= upgrade.cost ? "1" : "0.5";
        }
    });
}

// ✅ Handle resizing to fit the entire middle panel
window.addEventListener("resize", () => {
    if (window.phaserGame) {
        window.phaserGame.scale.resize(window.innerWidth * 0.5, window.innerHeight * 0.9);
    }
});

// ✅ Mowing function
function mowLawn(scene) {
    cash += cashPerClick;
    totalMows++;
    lifetimeEarnings += cashPerClick;

    // ✅ Update text UI in HTML, not Phaser
    document.getElementById("cash-display").textContent = cash;
    document.getElementById("mow-count").textContent = totalMows;

    // ✅ Click effect
    createClickEffect(scene.scale.width / 2, scene.scale.height / 2 - 50, cashPerClick, scene);

    console.log(`Lawn mowed! Cash: $${cash}, Total Mows: ${totalMows}`);
}

// ✅ Click Effect
function createClickEffect(x, y, amount, scene) {
    let effect = scene.add.text(x, y, `+$${amount}`, {
        fontSize: '24px',
        fill: '#ffcc00',
        fontWeight: 'bold'
    }).setOrigin(0.5);

    scene.tweens.add({
        targets: effect,
        y: y - 50,
        alpha: 0,
        duration: 800,
        ease: 'Power2',
        onComplete: () => effect.destroy()
    });
}

// ✅ Render Upgrades Properly in the Right Panel
function renderUpgrades() {
    let upgradeContainer = document.getElementById('upgrade-list');
    upgradeContainer.innerHTML = ''; // Clear old content

    upgrades.forEach((upgrade, index) => {
        let upgradeLevel = upgrade.count + 1 || 1; 
        let upgradeIteration = 1;

        let button = document.createElement('div');
        button.classList.add('upgrade-button');

        // Convert upgrade name to a valid folder structure
        let upgradeType = upgrade.name.toLowerCase().replace(/\s+/g, "_");

        // 🔥 Debugging log to confirm correct image paths
        let imagePath = `/assets/upgrades/${upgradeType}/${upgradeLevel}_${upgradeType}_v${upgradeIteration}.png`;
        console.log(`Upgrade ${index + 1}: ${upgrade.name} → ${imagePath}`);

        // Apply the background image
        button.style.backgroundImage = `url('${imagePath}')`;

        // Text Overlay
        let textOverlay = document.createElement('div');
        textOverlay.classList.add('upgrade-text');

        let title = document.createElement('div');
        title.classList.add('upgrade-title');
        title.innerText = upgrade.name;

        let costInfo = document.createElement('div');
        costInfo.classList.add('upgrade-info');
        costInfo.innerText = `Cost: $${upgrade.cost}`;

        let countInfo = document.createElement('div');
        countInfo.classList.add('upgrade-info');
        countInfo.innerText = `Owned: ${upgrade.count}`;

        textOverlay.appendChild(title);
        textOverlay.appendChild(costInfo);
        textOverlay.appendChild(countInfo);
        button.appendChild(textOverlay);

        // ✅ Append button to the upgrade container
        upgradeContainer.appendChild(button);
    });

    console.log("✅ Upgrades successfully rendered!");
}



// ✅ Purchase Upgrade
function purchaseUpgrade(index) {
    let upgrade = upgrades[index];

    if (cash >= upgrade.cost) {
        cash -= upgrade.cost;
        cashPerClick += upgrade.effect;
        upgrade.count++;
        upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.count));

        document.getElementById("cash-display").textContent = cash;
        renderUpgrades();

        console.log(`Purchased ${upgrade.name}! Cash per click: ${cashPerClick}`);
    } else {
        console.log("Not enough cash!");
    }
}

// ✅ Function to generate upgrade text dynamically
function getUpgradeText(upgrade) {
    if (!upgrade || typeof upgrade !== 'object') return "Unknown Upgrade"; 
    return `${upgrade.name} ($${upgrade.cost}) - Owned: ${upgrade.count}`;
}


