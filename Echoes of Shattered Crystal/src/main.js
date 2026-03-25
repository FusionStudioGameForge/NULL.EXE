// main.js
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
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#1a1a2e',
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