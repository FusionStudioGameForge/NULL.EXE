// src/scenes/VolcanoScene.js
// Chapter 4: Volcano of Flames
// =============================================

import { SCENES } from '../utils/constants.js';

export default class VolcanoScene extends Phaser.Scene {
    constructor() {
        super(SCENES.VOLCANO);
    }

    init(data) {
        this.playerType = data.playerType;
        this.shardsCollected = data.shardsCollected || 3;
        this.savedVillagers = data.savedVillagers || false;
    }

    create() {
        this.add.text(640, 60, 'CHAPTER 4 - Volcano of Flames', { fontSize: '36px' }).setOrigin(0.5);

        this.add.text(640, 300, 'Dash ability unlocked!\nPress SPACE to continue', {
            fontSize: '26px',
            fill: '#ff8800'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SCENES.MOUNTAIN, {
                playerType: this.playerType,
                shardsCollected: this.shardsCollected + 1,
                savedVillagers: this.savedVillagers
            });
        });
    }
}