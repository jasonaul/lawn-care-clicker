import { Beautify } from './game.js';
import { Game } from './game.js';


export const boosts = [
  {
      id: 0,
      name: "Sharper Blades",
      description: "Sharper blades increase mows per click by 1 for 30 seconds.",
      cost: 50,
      duration: 30, // Duration in seconds
      effect: { mowsPerClickBonus: 1 },
      isBought: false,
      unlocked: 1,
      isVisible: true,
      image: "/assets/boosts/sharper_blades.png"
  },
  {
      id: 1,
      name: "Nitrogen Fertilizer",
      description: "Fertilizer boosts mows per second by 50% for 60 seconds.",
      cost: 250,
      duration: 60,
      effect: { mowsPerSecondMultiplier: 1.5 }, // 50% boost multiplier
      isBought: false,
      unlocked: 0,
      isVisible: false,
      image: "/assets/boosts/fertilizer.png"
  },
  {
      id: 2,
      name: "Turbocharge",
      description: "Temporarily doubles all mows per second for 15 seconds.",
      cost: 500,
      duration: 15,
      effect: { globalMowsPerSecondMultiplier: 2 },
      isBought: false,
      unlocked: 0,
      isVisible: false,
      image: "/assets/boosts/turbocharge.png"
  },
  // ... more boosts ...
];

export function getDefaultBoosts() {
  return boosts.map(boost => ({ ...boost, isBought: false })); // Reset bought status
}

export function renderBoosts() {
  const container = document.getElementById("boost-list");
  if (!container) {
      console.error("Boost container element not found!");
      return;
  }
  container.innerHTML = "";

  boosts.forEach((boost, index) => {
      if (boost.unlocked && boost.isVisible) {
          const boostDiv = document.createElement("div");
          boostDiv.classList.add("boost-button");
          boostDiv.style.backgroundImage = `url('${boost.image || '/assets/placeholder_boost.png'}')`;
          if (boost.isBought) {
              boostDiv.classList.add("boost-button-bought"); // Add class if bought, style in CSS
          }

          const overlay = document.createElement("div");
          overlay.classList.add("boost-text");
          overlay.innerHTML = `
              <div class="boost-title">${boost.name}</div>
                 <div class="boost-info">Cost: ${Beautify(boost.cost, true)}</div> 

              <div class="boost-info">${boost.description}</div>
          `;
          boostDiv.appendChild(overlay);

          boostDiv.addEventListener('click', () => purchaseBoost(index));
          container.appendChild(boostDiv);
      }
  });
}

export function purchaseBoost(index) {
  const boost = boosts[index];
  if (!boost || boost.isBought) return; // Prevent buying twice or if boost is invalid

  if (Game.cash >= boost.cost) {
      Game.cash -= boost.cost;
      boost.isBought = true;
      applyBoostEffect(boost);
      renderBoosts(); // Update boost button appearance

      // Set a timeout to revert the boost effect after its duration
      setTimeout(() => {
          revertBoostEffect(boost);
          boost.isBought = false; // Allow buying again
          renderBoosts(); // Update button to purchasable state
      }, boost.duration * 1000);

      Game.notify(`${boost.name} Activated!`, 'boost');
  } else {
      Game.notify("Not enough cash to purchase boost!", 'warning');
  }
}

function applyBoostEffect(boost) {
  if (boost.effect.mowsPerClickBonus) {
      Game.tempMowsPerClickBonus += boost.effect.mowsPerClickBonus;
      Game.recalculateGains = 1; // Re-calculate MPS to reflect click bonus
  }
  if (boost.effect.mowsPerSecondMultiplier) {
      Game.tempMowsPerSecondMultiplier *= boost.effect.mowsPerSecondMultiplier;
      Game.recalculateGains = 1;
  }
  if (boost.effect.globalMowsPerSecondMultiplier) {
      Game.tempGlobalMowsPerSecondMultiplier *= boost.effect.globalMowsPerSecondMultiplier;
      Game.recalculateGains = 1;
  }
}

function revertBoostEffect(boost) {
  if (boost.effect.mowsPerClickBonus) {
      Game.tempMowsPerClickBonus -= boost.effect.mowsPerClickBonus;
      Game.recalculateGains = 1;
  }
  if (boost.effect.mowsPerSecondMultiplier) {
      Game.tempMowsPerSecondMultiplier /= boost.effect.mowsPerSecondMultiplier;
      Game.recalculateGains = 1;
  }
  if (boost.effect.globalMowsPerSecondMultiplier) {
      Game.tempGlobalMowsPerSecondMultiplier /= boost.effect.globalMowsPerSecondMultiplier;
      Game.recalculateGains = 1;
  }
}