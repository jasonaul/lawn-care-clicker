// public/src/main.js
import { Game } from './game.js';
import Phaser from 'phaser';
import { loadSounds } from './sounds.js';

window.onerror = function(message, source, lineno, colno, error) {
    console.error("Global Error Handler - An error occurred:", message);
    console.error("Source:", source);
    console.error("Line Number:", lineno);
    console.error("Column Number:", colno);
    console.error("Error Object:", error);
    return true; // Prevents browser's default error reporting
};

const config = {
    type: Phaser.AUTO,
    parent: "lawn-container",
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: "#36d700",
    scene: {
        preload: preload,
        create: create, // Removed .bind(this) - will handle context inside create
        update: update
    },
    fps: {
        target: 30,
        forceSetTimeOut: true
    },
};

let soundsInitialized = false;
window.phaserGame = new Phaser.Game(config);
let gameScene; // To hold the Phaser scene instance

function preload() {
    console.log("Phaser scene preload started.");
    gameScene = this; // Assign scene instance to gameScene in preload - **ENSURE THIS IS BEFORE LOADING ASSETS**
    this.load.image('grass', 'assets/grass.png'); // Placeholder asset
    // Load other assets here if needed, after setting gameScene
}

function create() {
    console.log("Phaser scene create started.");
    const scene = this; // Capture 'this' in a local variable

    scene.lawn = scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2, 200, 200, 0x36d700).setInteractive();
    scene.lawn.setOrigin(0.5);
    scene.lawn.on('pointerdown', () => {
        if (!soundsInitialized) {
            loadSounds(); // Initialize sounds on first click
            soundsInitialized = true;
            console.log("Sounds Initialized on first click.");
        }
        Game.mowLawn(scene); // Pass the scene context
    });
    Game.Init(); // Initialize game logic after Phaser is ready
    console.log("Phaser scene create finished.");
}

function update() {
    // Phaser update loop - visual updates if needed
}

// Notification Area (outside Phaser context)
const notificationArea = document.createElement('div');
notificationArea.id = 'notification-area';
document.body.appendChild(notificationArea);

console.log("main.js execution finished, Phaser game created and initialized.");

export default gameScene; // Export gameScene if you need to access it elsewhere