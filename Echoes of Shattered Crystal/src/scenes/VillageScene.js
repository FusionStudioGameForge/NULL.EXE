// src/scenes/VillageScene.js - Chapter 1
import { SCENES } from '../utils/constants.js';

export default class VillageScene extends Phaser.Scene {
    constructor() {
        super(SCENES.VILLAGE);
    }

    init(data) {
        this.playerType = data.playerType || 'aria';
        this.shards = data.shards || 0;
    }

    create() {
        this.add.image(640, 360, 'village_bg').setScale(1.1);

        this.add.text(640, 60, 'CHAPTER 1 - Village of Shadows', {
            fontSize: '36px',
            fill: '#ffdd00'
        }).setOrigin(0.5);

        this.add.text(640, 320, 'The sacred crystal has shattered...\nMonsters are attacking!\n\nPress SPACE to continue', {
            fontSize: '26px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SCENES.FOREST, { playerType: this.playerType, shards: this.shards + 1 });
        });
    }
}