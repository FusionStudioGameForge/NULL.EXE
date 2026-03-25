// =============================================
// This is the main entry file for the entire game.
// It sets up the Phaser game configuration and registers all scenes.
// =============================================

import BootScene from './src/scenes/BootScene.js';
import MenuScene from './src/scenes/MenuScene.js';
import CharacterSelectScene from './src/scenes/CharacterSelectScene.js';
import VillageScene from './src/scenes/VillageScene.js';
import ForestScene from './src/scenes/ForestScene.js';
import GraveyardScene from './src/scenes/GraveyardScene.js';
import VolcanoScene from './src/scenes/VolcanoScene.js';
import MountainScene from './src/scenes/MountainScene.js';

import { SCENES } from './src/utils/constants.js';

const config = {
    type: Phaser.AUTO,                    // Phaser will choose WebGL or Canvas automatically
    width: 1280,                          // Game resolution (good for most screens)
    height: 720,
    backgroundColor: '#1a1a2e',           // Dark background color
    physics: {
        default: 'arcade',                // Simple 2D physics (gravity, collisions)
        arcade: {
            gravity: { y: 800 },          // Gravity for jumping
            debug: false                  // Set to true if you want to see hitboxes
        }
    },
    scene: [                              // List of all scenes in order
        BootScene,
        MenuScene,
        CharacterSelectScene,
        VillageScene,
        ForestScene,
        GraveyardScene,
        VolcanoScene,
        MountainScene
    ]
};

new Phaser.Game(config);