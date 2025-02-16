import { Beautify } from './game.js';
 import { boosts, purchaseBoost } from './boosts.js'; // Import boosts and purchaseBoost for random boost effect in shop
 import { Game } from './game.js';

export const shopItems = [
  {
      id: 0,
      name: "Mystery Seed Pack",
      description: "Unlocks a random boost or a small permanent bonus.",
      cost: 750,
      effect: "random_boost_or_bonus",
      image: "/assets/shop/seed_pack.png",
      unlocked: 0, // Initially locked
      isVisible: false,
  },
  {
      id: 1,
      name: "Golden Lawnmower Skin",
      description: "Purely cosmetic. Show off your wealth!",
      cost: 5000,
      effect: "cosmetic_lawnmower_skin",
      image: "/assets/shop/golden_lawnmower.png",
      unlocked: 0,
      isVisible: false,
  },
  // ... more shop items ...
];

export function getDefaultShopItems() {
  return shopItems.map(item => ({ ...item, isBought: false }));
}

export function renderShop() {
  const container = document.getElementById("shop-list");
  if (!container) {
      console.error("Shop container not found!");
      return;
  }
  container.innerHTML = "";

  shopItems.forEach((item, index) => {
      if (item.unlocked && item.isVisible) {
          const shopItemDiv = document.createElement("div");
          shopItemDiv.classList.add("shop-item");
          shopItemDiv.style.backgroundImage = `url('${item.image || '/assets/placeholder_shop_item.png'}')`;

          const overlay = document.createElement("div");
          overlay.classList.add("shop-text");
          overlay.innerHTML = `
              <div class="shop-title">${item.name}</div>
              <div class="shop-info">Cost: $${Beautify(item.cost)}</div>
              <div class="shop-desc">${item.description}</div>
          `;
          shopItemDiv.appendChild(overlay);

          shopItemDiv.addEventListener('click', () => purchaseShopItem(index));
          container.appendChild(shopItemDiv);
      }
  });
}

export function purchaseShopItem(index) {
  const item = shopItems[index];
  if (!item) return;

  if (Game.cash >= item.cost) {
      Game.cash -= item.cost;
      applyShopItemEffect(item);
      item.isBought = true; // Mark as bought, may want to handle differently for repeatable items
      renderShop(); // Update shop display

      Game.notify(`${item.name} Purchased!`, 'shop');
  } else {
      Game.notify("Not enough cash to purchase shop item!", 'warning');
  }
}

function applyShopItemEffect(item) {
  if (item.effect === "random_boost_or_bonus") {
      const randomValue = Math.random();
      if (randomValue < 0.5) {
          // Grant a random boost
          const availableBoosts = boosts.filter(boost => !boost.isBought && boost.unlocked && boost.isVisible);
          if (availableBoosts.length > 0) {
              const randomBoost = availableBoosts[Math.floor(Math.random() * availableBoosts.length)];
              purchaseBoost(boosts.indexOf(randomBoost)); // Directly purchase the boost
              Game.notify(`Mystery Seed Pack granted you: ${randomBoost.name}!`, 'shop-effect');
          } else {
              Game.notify("Mystery Seed Pack: No boosts available, gained a small cash bonus instead!", 'shop-effect');
              Game.cash += 100; // Small cash bonus if no boosts available
              Game.UpdateCashDisplay();
          }
      } else {
          // Grant a small permanent bonus (example: +5% MPS)
          Game.tempGlobalMowsPerSecondMultiplier *= 1.05; // 5% MPS increase
          Game.recalculateGains = 1;
          Game.notify("Mystery Seed Pack granted you a permanent +5% Mows Per Second bonus!", 'shop-effect');
      }
  } else if (item.effect === "cosmetic_lawnmower_skin") {
      // Cosmetic effect - implement visual change in Phaser if needed
      Game.notify("Golden Lawnmower Skin applied! (Cosmetic effect)", 'shop-effect');
  }
  // ... handle other shop item effects ...
}

// function Beautify(val) { // Re-use the Beautify function or import if modularized
//   var notations = ['', 'k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'ODc', 'NDc'];
//   var notation = '';
//   var base = 0;
//   if (!isFinite(val)) return 'Infinity';
//   if (val >= 1000) {
//       val /= 1000;
//       while (Math.round(val) >= 1000) {
//           val /= 1000;
//           base++;
//       }
//       if (base >= notations.length) {
//           return 'Infinity';
//       } else {
//           notation = notations[base];
//       }
//   }
//   return (Math.round(val * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + notation;
// }
