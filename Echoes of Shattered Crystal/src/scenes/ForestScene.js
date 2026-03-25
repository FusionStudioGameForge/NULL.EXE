// src/scenes/ForestScene.js
// Chapter 2: Forest of Whispers
// Unlocks first new ability
// =============================================

import { SCENES } from '../utils/constants.js';

export default class ForestScene extends Phaser.Scene {
    constructor() {
        super(SCENES.FOREST);
    }

    init(data) {
        this.playerType = data.playerType;
        this.shardsCollected = data.shardsCollected || 1;
    }

    create() {
        this.add.text(640, 60, 'CHAPTER 2 - Forest of Whispers', { fontSize: '36px' }).setOrigin(0.5);

        this.add.text(640, 300, 'You defeated the shadow beasts!\nNew ability unlocked!\n\nPress SPACE', {
            fontSize: '26px',
            fill: '#00ff88',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SCENES.GRAVEYARD, {
                playerType: this.playerType,
                shardsCollected: this.shardsCollected + 1
            });
        });
    }
}