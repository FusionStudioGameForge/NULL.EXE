// src/scenes/BootScene.js
// =============================================
// First scene that runs when the game starts.
// Used to load all assets (images, sounds, tilemaps) before showing the menu.
// =============================================

import { SCENES } from '../utils/constants.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super(SCENES.BOOT);
    }

    preload() {
        console.log('BootScene: Preloading assets...');

        // TODO: Add your real assets here when you download them
        // Example:
        // this.load.image('village_bg', 'assets/images/backgrounds/village.png');
        // this.load.spritesheet('aria', 'assets/spritesheets/aria.png', { frameWidth: 64, frameHeight: 64 });
        // this.load.audio('sword_swing', 'assets/audio/sfx/sword_swing.mp3');

        console.log('BootScene: Preload complete');
    }

    create() {
        console.log('BootScene: Starting Menu Scene');
        this.scene.start(SCENES.MENU);
    }
}