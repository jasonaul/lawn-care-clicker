import { Game } from './game.js';

export const achievements = [
  {
      id: 0,
      name: "First Mow!",
      description: "Mow your first patch of lawn.",
      requirement: 1, // Mow 1 time
      achieved: false,
      image: "/assets/achievements/first_mow.png" // Placeholder image
  },
  {
      id: 1,
      name: "100 Mows",
      description: "Mow the lawn 100 times.",
      requirement: 100,
      achieved: false,
      image: "/assets/achievements/100_mows.png"
  },
  {
      id: 2,
      name: "1,000 Mows",
      description: "Mow the lawn 1,000 times.",
      requirement: 1000,
      achieved: false,
      image: "/assets/achievements/1000_mows.png"
  },
  {
      id: 3,
      name: "Employee Acquired",
      description: "Purchase your first Employee.",
      requirement: "employee_owned", // Special requirement type
      achieved: false,
      image: "/assets/achievements/employee_acquired.png"
  },
  {
      id: 4,
      name: "10 Employees",
      description: "Own 10 Employees.",
      requirement: { building: "Employee", amount: 10 }, // Complex requirement
      achieved: false,
      image: "/assets/achievements/10_employees.png"
  },
  {
      id: 5,
      name: "Cash is King",
      description: "Reach $1,000 in cash.",
      requirement: 1000, // $1,000 cash
      achieved: false,
      check: () => Game.cash >= 1000, // Custom check function
      image: "/assets/achievements/cash_king.png"
  },
  {
      id: 6,
      name: "Prestige Starter",
      description: "Prestige for the first time.",
      requirement: "prestige_reset", // Triggered on prestige reset
      achieved: false,
      image: "/assets/achievements/prestige_starter.png"
  },
  // ... more achievements can be added here ...
];

export function getDefaultAchievements() {
  return achievements.map(ach => ({ ...ach, achieved: false })); // Reset achieved status
}

export function renderAchievements() {
  const container = document.getElementById("achievement-list");
  if (!container) {
      console.error("Achievement container not found!");
      return;
  }
  container.innerHTML = ""; // Clear existing achievements

  achievements.forEach(achievement => {
      const achievementDiv = document.createElement("div");
      achievementDiv.classList.add("achievement");
      achievementDiv.style.opacity = achievement.achieved ? 1 : 0.6; // Dim if not achieved

      const overlay = document.createElement("div");
      overlay.classList.add("achievement-text");
      overlay.innerHTML = `
          <div class="achievement-title">${achievement.name}</div>
          <div class="achievement-desc">${achievement.description}</div>
          ${achievement.achieved ? '<div class="achieved-badge">Achieved!</div>' : ''}
      `;
      achievementDiv.appendChild(overlay);
      achievementDiv.style.backgroundImage = `url('${achievement.image || '/assets/placeholder_achievement.png'}')`; // Use placeholder if no image

      container.appendChild(achievementDiv);
  });
}

export function checkAchievements() {
  let achievementUpdates = false;
  achievements.forEach(achievement => {
      if (!achievement.achieved) {
          let requirementMet = false;

          if (typeof achievement.requirement === 'number') {
              requirementMet = Game.mowClicks >= achievement.requirement;
          } else if (typeof achievement.requirement === 'string') {
              if (achievement.requirement === 'employee_owned') {
                  requirementMet = Game.BuildingsOwned > 0 && Game.Objects['Employee'].amount > 0;
              } else if (achievement.requirement === 'prestige_reset') {
                  requirementMet = Game.prestigeResets > 0; // Check if prestige has been done
              }
          } else if (typeof achievement.requirement === 'object') {
              if (achievement.requirement.building && achievement.requirement.amount) {
                  requirementMet = Game.Objects[achievement.requirement.building].amount >= achievement.requirement.amount;
              }
          } else if (typeof achievement.check === 'function') {
              requirementMet = achievement.check(); // Use custom check function
          }

          if (requirementMet) {
              achievement.achieved = true;
              achievementUpdates = true;
              Game.notify(`${achievement.name} Achieved! - ${achievement.description}`, 'achievement');
          }
      }
  });

  if (achievementUpdates) {
      renderAchievements(); // Re-render to update display
  }
}