import Phaser from 'phaser';
import { renderUpgrades, purchaseUpgrade, upgrades } from './upgrades.js';

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

// Global Game Variables (if not already defined)
window.cash = 0;
window.cashPerClick = 1;
window.totalMows = 0;
window.lifetimeEarnings = 0;

// Declare lawn variable for the Phaser scene.
let lawn;

function preload() {
  console.log("Preloading assets...");
}
function create() {
    console.log("Game scene created!");
    let width = this.scale.width;
    let height = this.scale.height;
  
    // Create the lawn area (the clickable region)
    lawn = this.add.rectangle(width / 2, height / 2, width * 0.6, height * 0.6, 0x228B22)
      .setInteractive()
      .on('pointerdown', () => mowLawn(this));
  
    // Add the "Click to Mow!" text inside the lawn
    this.add.text(width / 2, height / 2, "🚜 Click to Mow!", {
      fontSize: '24px',
      fill: '#fff'
    }).setOrigin(0.5);
  
    // Render upgrades in the right panel (from upgrades.js)
    renderUpgrades();
  
    // Set up auto-mowing: every 1000ms (1 second) call autoMow()
    this.time.addEvent({
      delay: 1000,
      callback: autoMow,
      callbackScope: this,
      loop: true
    });
  }

  function update() {
    document.getElementById("cash-display").textContent = window.cash;
    document.getElementById("mow-count").textContent = window.totalMows;
  }
  
  // Manual mow (triggered by clicking the lawn)
  function mowLawn(scene) {
    window.cash += window.cashPerClick;
    window.totalMows++;
    window.lifetimeEarnings += window.cashPerClick;
    document.getElementById("cash-display").textContent = window.cash;
    document.getElementById("mow-count").textContent = window.totalMows;
    createClickEffect(scene.scale.width / 2, scene.scale.height / 2 - 50, window.cashPerClick, scene);
    console.log(`Lawn mowed! Cash: $${window.cash}, Total Mows: ${window.totalMows}`);
  }
  
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

// NEW: Auto-mow function with complex scaling.
// This function computes the auto-production each second based on the current
// counts of auto upgrades and the equipment owned.
function autoMow() {
    // Get counts from the first four upgrades:
    const betterCount = upgrades[0].count;
    const electricCount = upgrades[1].count;
    const ridingCount = upgrades[2].count;
    const employeeCount = upgrades[3].count;
  
    // For Employee, cash per mow comes from the total of the click equipment.
    const equipmentFactorForEmployee = betterCount + electricCount + ridingCount;
    // For upgrades #5–#14, the equipment factor includes Employees as well.
    const equipmentFactorForOthers = betterCount + electricCount + ridingCount + employeeCount;
  
    let totalAutoCash = 0;
    let totalAutoMows = 0;
  
    // Process Employee upgrade (index 3)
    const employeeUpgrade = upgrades[3];
    const employeeMows = employeeUpgrade.count * employeeUpgrade.baseMows; // normally 1 per employee
    const employeeCashPerMow = equipmentFactorForEmployee;
    totalAutoCash += employeeMows * employeeCashPerMow;
    totalAutoMows += employeeMows;
  
    // Process upgrades #5 to #14 (indices 4–13)
    for (let i = 4; i < upgrades.length; i++) {
      const upg = upgrades[i];
      // Exponential scaling: effective mows = count * baseMows * (1.15^count)
      const effectiveMows = upg.count * upg.baseMows * Math.pow(1.15, upg.count);
      // Cash per mow for these upgrades is scaled by the total equipment factor.
      const cashPerMow = upg.baseCash * equipmentFactorForOthers;
      totalAutoCash += effectiveMows * cashPerMow;
      totalAutoMows += effectiveMows;
    }
  
    if (totalAutoCash > 0) {
      window.cash += totalAutoCash;
      window.totalMows += totalAutoMows;
      window.lifetimeEarnings += totalAutoCash;
      document.getElementById("cash-display").textContent = window.cash;
      document.getElementById("mow-count").textContent = window.totalMows;
      console.log(`Auto-mowed! +$${totalAutoCash.toFixed(2)} cash, ${totalAutoMows.toFixed(2)} mows`);
    }
  }