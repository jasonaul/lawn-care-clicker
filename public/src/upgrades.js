// /src/upgrades.js

export const upgrades = [
    // (Indices 0-2: Click Upgrades)
    {
      name: "Better Mower",
      type: "click",
      baseCost: 10,
      cost: 10,
      cashPerClick: 1,  // each unit adds +$1 per click
      count: 0,
      priceIncrease: 1.15,
      image: '/assets/upgrades/better_mower.png'
    },
    {
      name: "Electric Mower",
      type: "click",
      baseCost: 50,
      cost: 50,
      cashPerClick: 2,  // each unit adds +$2 per click
      count: 0,
      priceIncrease: 1.15,
      image: '/assets/upgrades/electric_mower.png'
    },
    {
      name: "Riding Mower",
      type: "click",
      baseCost: 200,
      cost: 200,
      cashPerClick: 5,  // each unit adds +$5 per click
      count: 0,
      priceIncrease: 1.15,
      image: '/assets/upgrades/riding_mower.png'
    },
    // (Index 3: Special Auto Upgrade – Employee)
    {
      name: "Employee",
      type: "auto",
      baseCost: 500,
      cost: 500,
      // Each Employee gives 1 auto mow per second.
      // The cash earned per auto mow will equal the sum of Better, Electric, and Riding counts.
      baseMows: 1,
      count: 0,
      priceIncrease: 1.15,
      image: '/assets/upgrades/employee.png'
    },
    // (Indices 4-13: Auto Upgrades with Exponential scaling)
    {
      name: "Precision Pruners",
      type: "auto",
      baseCost: 2500,
      cost: 2500,
      // Each unit adds 5 mows per second (before exponential scaling)
      baseMows: 5,
      // Base cash per mow is $1; this will be multiplied by your equipment factor.
      baseCash: 1,
      count: 0,
      priceIncrease: 1.25,
      image: '/assets/upgrades/precision_pruners.png'
    },
    {
      name: "Lawn Llama",
      type: "auto",
      baseCost: 10000,
      cost: 10000,
      baseMows: 15,
      baseCash: 1.2,
      count: 0,
      priceIncrease: 1.25,
      image: '/assets/upgrades/lawn_llama.png'
    },
    {
      name: "Grass Guru",
      type: "auto",
      baseCost: 50000,
      cost: 50000,
      baseMows: 50,
      baseCash: 1.5,
      count: 0,
      priceIncrease: 1.3,
      image: '/assets/upgrades/grass_guru.png'
    },
    {
      name: "Sod Slayer",
      type: "auto",
      baseCost: 200000,
      cost: 200000,
      baseMows: 150,
      baseCash: 2,
      count: 0,
      priceIncrease: 1.3,
      image: '/assets/upgrades/sod_slayer.png'
    },
    {
      name: "Turbo Trimmer",
      type: "auto",
      baseCost: 1000000,
      cost: 1000000,
      baseMows: 500,
      baseCash: 2.5,
      count: 0,
      priceIncrease: 1.35,
      image: '/assets/upgrades/turbo_trimmer.png'
    },
    {
      name: "Orbiting Overseer",
      type: "auto",
      baseCost: 5000000,
      cost: 5000000,
      baseMows: 2000,
      baseCash: 3,
      count: 0,
      priceIncrease: 1.35,
      image: '/assets/upgrades/orbiting_overseer.png'
    },
    {
      name: "Mega Mulcher",
      type: "auto",
      baseCost: 25000000,
      cost: 25000000,
      baseMows: 10000,
      baseCash: 3.5,
      count: 0,
      priceIncrease: 1.4,
      image: '/assets/upgrades/mega_mulcher.png'
    },
    {
      name: "Hyper Horticulturist",
      type: "auto",
      baseCost: 100000000,
      cost: 100000000,
      baseMows: 50000,
      baseCash: 4,
      count: 0,
      priceIncrease: 1.4,
      image: '/assets/upgrades/hyper_horticulturist.png'
    },
    {
      name: "Quantum Quencher",
      type: "auto",
      baseCost: 500000000,
      cost: 500000000,
      baseMows: 250000,
      baseCash: 4.5,
      count: 0,
      priceIncrease: 1.45,
      image: '/assets/upgrades/quantum_quencher.png'
    },
    {
      name: "Cosmic Cultivator",
      type: "auto",
      baseCost: 2500000000,
      cost: 2500000000,
      baseMows: 1000000,
      baseCash: 5,
      count: 0,
      priceIncrease: 1.45,
      image: '/assets/upgrades/cosmic_cultivator.png'
    }
  ];
  
  export function renderUpgrades() {
    const upgradeContainer = document.getElementById('upgrade-list');
    upgradeContainer.innerHTML = '';
  
    upgrades.forEach((upgrade, index) => {
      const button = document.createElement('div');
      button.classList.add('upgrade-button');
      // Use the fixed image – it won’t change on purchase.
      button.style.backgroundImage = `url('${upgrade.image}')`;
  
      const textOverlay = document.createElement('div');
      textOverlay.classList.add('upgrade-text');
  
      const title = document.createElement('div');
      title.classList.add('upgrade-title');
      title.innerText = upgrade.name;
  
      const costInfo = document.createElement('div');
      costInfo.classList.add('upgrade-info');
      costInfo.innerText = `Cost: $${upgrade.cost}`;
  
      const countInfo = document.createElement('div');
      countInfo.classList.add('upgrade-info');
      countInfo.innerText = `Owned: ${upgrade.count}`;
  
      textOverlay.appendChild(title);
      textOverlay.appendChild(costInfo);
      textOverlay.appendChild(countInfo);
      button.appendChild(textOverlay);
  
      button.addEventListener('click', () => {
        purchaseUpgrade(index);
      });
  
      upgradeContainer.appendChild(button);
    });
  
    console.log("✅ Upgrades successfully rendered!");
  }
  
  export function purchaseUpgrade(index) {
    const upgrade = upgrades[index];
    if (window.cash >= upgrade.cost) {
      window.cash -= upgrade.cost;
      upgrade.count++;
      // Increase cost exponentially using the defined priceIncrease multiplier.
      upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.priceIncrease, upgrade.count));
  
      if (upgrade.type === "click") {
        // For click upgrades, add to cashPerClick.
        window.cashPerClick += upgrade.cashPerClick;
      }
      // For auto upgrades, the production is calculated dynamically in main.js.
      renderUpgrades();
      console.log(`Purchased ${upgrade.name}!`);
    } else {
      console.log("Not enough cash!");
    }
  }
  