// main.js
// =============================================
// MAIN ENTRY POINT OF THE GAME
// Sets up Phaser configuration and registers all scenes
// =============================================

import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import VillageScene from './scenes/VillageScene.js';
import ForestScene from './scenes/ForestScene.js';
import GraveyardScene from './scenes/GraveyardScene.js';
import VolcanoScene from './scenes/VolcanoScene.js';
import MountainScene from './scenes/MountainScene.js';

import { SCENES } from './utils/constants.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#0a0a1f',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [
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