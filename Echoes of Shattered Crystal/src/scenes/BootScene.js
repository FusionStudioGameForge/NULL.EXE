// src/scenes/BootScene.js
import { SCENES } from '../utils/constants.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super(SCENES.BOOT);
    }

    preload() {
        // Backgrounds
        this.load.image('village_bg', 'assets/images/backgrounds/village.png');
        this.load.image('forest_bg', 'assets/images/backgrounds/forest.png');
        this.load.image('graveyard_bg', 'assets/images/backgrounds/graveyard.png');
        this.load.image('volcano_bg', 'assets/images/backgrounds/volcano.png');
        this.load.image('mountain_bg', 'assets/images/backgrounds/mountain.png');

        // Tilemaps (add later when you create them in Tiled)
        this.load.tilemapTiledJSON('village_map', 'assets/tilemaps/village.json');
        this.load.tilemapTiledJSON('forest_map', 'assets/tilemaps/forest.json');
        this.load.tilemapTiledJSON('graveyard_map', 'assets/tilemaps/graveyard.json');
        this.load.tilemapTiledJSON('volcano_map', 'assets/tilemaps/volcano.json');
        this.load.tilemapTiledJSON('mountain_map', 'assets/tilemaps/mountain.json');

        // Characters & Enemies
        this.load.spritesheet('aria', 'assets/spritesheets/aria.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('orion', 'assets/spritesheets/orion.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('dragon', 'assets/spritesheets/dragon.png', { frameWidth: 128, frameHeight: 128 });

        // Items
        this.load.image('shard', 'assets/images/shards/shard.png');

        console.log('✅ All assets preloaded');
    }

    create() {
        this.scene.start(SCENES.MENU);
    }
}