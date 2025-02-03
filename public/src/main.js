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
const upgrades = [
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
    upgradeContainer.innerHTML = ''; 

    upgrades.forEach((upgrade, index) => {
        let button = document.createElement('button');
        button.classList.add('upgrade-button'); 
        button.innerText = getUpgradeText(upgrade);

        button.onclick = () => purchaseUpgrade(index);
        upgradeContainer.appendChild(button);
        upgradeButtons.push(button);
    });

    console.log("Upgrades successfully rendered!");
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
