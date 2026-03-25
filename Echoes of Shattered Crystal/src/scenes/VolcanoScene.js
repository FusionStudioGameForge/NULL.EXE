// src/scenes/VolcanoScene.js - Chapter 4
import { SCENES } from '../utils/constants.js';

export default class VolcanoScene extends Phaser.Scene {
    constructor() {
        super(SCENES.VOLCANO);
    }

    init(data) {
        this.playerType = data.playerType;
        this.shards = data.shards || 3;
    }

    create() {
        this.add.image(640, 360, 'volcano_bg').setScale(1.1);

        this.add.text(640, 60, 'CHAPTER 4 - Volcano of Flames', {
            fontSize: '36px',
            fill: '#ff8800'
        }).setOrigin(0.5);

        this.add.text(640, 320, 'Dash ability unlocked!\nPress SPACE to continue', {
            fontSize: '26px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SCENES.MOUNTAIN, { playerType: this.playerType, shards: this.shards + 1 });
        });
    }
}