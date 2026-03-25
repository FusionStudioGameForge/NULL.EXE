// src/scenes/VolcanoScene.js
import { SCENES } from '../utils/constants.js';

export default class VolcanoScene extends Phaser.Scene {
    constructor() {
        super(SCENES.VOLCANO);
    }

    init(data) {
        this.playerType = data.playerType;
        this.shards = data.shards || 3;
        this.abilities = data.abilities || [];
        this.savedVillagers = data.savedVillagers || false;
    }

    create() {
        this.add.text(640, 60, 'Chapter 4 - Volcano of Flames', { fontSize: '36px' }).setOrigin(0.5);
        this.add.text(640, 300, 'Dash ability unlocked!\n(Press SPACE)', { fontSize: '26px', fill: '#f80' }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SCENES.MOUNTAIN, {
                playerType: this.playerType,
                shards: this.shards + 1,
                abilities: [...this.abilities, 'dash'],
                savedVillagers: this.savedVillagers
            });
        });
    }
}