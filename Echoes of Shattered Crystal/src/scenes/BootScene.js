// src/scenes/BootScene.js
// =============================================
// First scene that runs
// Loads all background images (and will load more assets later)
// =============================================

import { SCENES } from '../utils/constants.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super(SCENES.BOOT);
    }

    preload() {
        console.log('BootScene: Loading background images...');

        // Load the 5 background images you provided
        this.load.image('village_bg',   'assets/images/backgrounds/village_bg.png');
        this.load.image('forest_bg',    'assets/images/backgrounds/forest_bg.png');
        this.load.image('graveyard_bg', 'assets/images/backgrounds/graveyard_bg.png');
        this.load.image('volcanoe_bg',   'assets/images/backgrounds/volcanoe_bg.png');
        this.load.image('mountain_bg',  'assets/images/backgrounds/mountain_bg.png');

        console.log('BootScene: All backgrounds loaded');
    }

    create() {
        console.log('BootScene finished → Starting Menu');
        this.scene.start(SCENES.MENU);
    }
}