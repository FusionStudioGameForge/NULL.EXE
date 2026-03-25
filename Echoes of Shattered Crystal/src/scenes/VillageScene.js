// src/scenes/VillageScene.js
// =============================================
// Chapter 1: Village of Shadows
// The crystal shatters and first battle begins
// =============================================

import { SCENES, PLAYER } from '../utils/constants.js';

export default class VillageScene extends Phaser.Scene {
    constructor() {
        super(SCENES.VILLAGE);
    }

    init(data) {
        this.playerType = data.playerType || PLAYER.ARIA;
        this.shardsCollected = data.shardsCollected || 0;
    }

    create() {
        this.add.text(640, 60, 'CHAPTER 1 - Village of Shadows', {
            fontSize: '36px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(640, 300, 'The sacred crystal has shattered!\nMonsters are attacking the village...\n\nPress SPACE to continue', {
            fontSize: '26px',
            fill: '#ffdd00',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SCENES.FOREST, {
                playerType: this.playerType,
                shardsCollected: this.shardsCollected + 1
            });
        });
    }
}