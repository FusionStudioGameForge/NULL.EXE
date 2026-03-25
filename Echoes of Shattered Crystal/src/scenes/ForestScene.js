// src/scenes/ForestScene.js - Chapter 2
import { SCENES } from '../utils/constants.js';

export default class ForestScene extends Phaser.Scene {
    constructor() {
        super(SCENES.FOREST);
    }

    init(data) {
        this.playerType = data.playerType;
        this.shards = data.shards || 1;
    }

    create() {
        this.add.image(640, 360, 'forest_bg').setScale(1.1);

        this.add.text(640, 60, 'CHAPTER 2 - Forest of Whispers', {
            fontSize: '36px',
            fill: '#00ff88'
        }).setOrigin(0.5);

        this.add.text(640, 320, 'New ability unlocked!\nPress SPACE to continue', {
            fontSize: '26px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SCENES.GRAVEYARD, { playerType: this.playerType, shards: this.shards + 1 });
        });
    }
}