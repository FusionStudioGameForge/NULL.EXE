// src/main.js
// =============================================
// Phaser 3 game configuration and boot
// =============================================

import BootScene            from './scenes/BootScene.js';
import MenuScene            from './scenes/MenuScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import VillageScene         from './scenes/VillageScene.js';
import ForestScene          from './scenes/ForestScene.js';
import GraveyardScene       from './scenes/GraveyardScene.js';
import VolcanoScene         from './scenes/VolcanoScene.js';
import MountainScene        from './scenes/MountainScene.js';
import VictoryScene, { GameOverScene } from './scenes/VictoryScene.js';

const config = {
    type: Phaser.AUTO,
    width:  1280,
    height: 720,
    backgroundColor: '#0a0a1a',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false,   // set true to see hitboxes during development
        },
    },

    scene: [
        BootScene,
        MenuScene,
        CharacterSelectScene,
        VillageScene,
        ForestScene,
        GraveyardScene,
        VolcanoScene,
        MountainScene,
        VictoryScene,
        GameOverScene,
    ],
};

const game = new Phaser.Game(config);

export default game;
