// src/scenes/VillageScene.js
import { SCENES, PLAYER } from '../utils/constants.js';

export default class VillageScene extends Phaser.Scene {
    constructor() {
        super(SCENES.VILLAGE);
    }

    init(data) {
        this.playerType = data.playerType || PLAYER.ARIA;
        this.shards = data.shards || 0;
        this.abilities = data.abilities || [];
    }

    create() {
        this.add.text(640, 60, 'Chapter 1 - Village of Shadows', {
            fontSize: '36px',
            fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(640, 300, 'The crystal shatters...\nMonsters attack!\n\n(Press SPACE to continue)', {
            fontSize: '26px',
            fill: '#ff0',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SCENES.FOREST, {
                playerType: this.playerType,
                shards: this.shards + 1,
                abilities: this.abilities
            });
        });
    }
}