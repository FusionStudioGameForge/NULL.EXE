// src/scenes/ForestScene.js
import { SCENES } from '../utils/constants.js';

export default class ForestScene extends Phaser.Scene {
    constructor() {
        super(SCENES.FOREST);
    }

    init(data) {
        this.playerType = data.playerType;
        this.shards = data.shards || 1;
        this.abilities = data.abilities || [];
    }

    create() {
        this.add.text(640, 60, 'Chapter 2 - Forest of Whispers', { fontSize: '36px' }).setOrigin(0.5);
        this.add.text(640, 300, 'New ability unlocked!\n(Press SPACE)', { fontSize: '26px', fill: '#0f0' }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SCENES.GRAVEYARD, {
                playerType: this.playerType,
                shards: this.shards + 1,
                abilities: [...this.abilities, 'speedAttack']
            });
        });
    }
}