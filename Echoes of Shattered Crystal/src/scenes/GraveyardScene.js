// src/scenes/GraveyardScene.js - Chapter 3
import { SCENES } from '../utils/constants.js';

export default class GraveyardScene extends Phaser.Scene {
    constructor() {
        super(SCENES.GRAVEYARD);
    }

    init(data) {
        this.playerType = data.playerType;
        this.shards = data.shards || 2;
    }

    create() {
        this.add.image(640, 360, 'graveyard_bg').setScale(1.1);

        this.add.text(640, 60, "CHAPTER 3 - The Dead Man's Elm", {
            fontSize: '36px',
            fill: '#ff88ff'
        }).setOrigin(0.5);

        const saveBtn = this.add.text(400, 380, 'SAVE THE VILLAGERS\n(Gain allies later)', {
            fontSize: '26px', fill: '#00ff00', align: 'center'
        }).setOrigin(0.5).setInteractive();

        const ignoreBtn = this.add.text(880, 380, 'IGNORE THEM\n(Gain more power)', {
            fontSize: '26px', fill: '#ff0000', align: 'center'
        }).setOrigin(0.5).setInteractive();

        saveBtn.on('pointerdown', () => this.nextChapter(true));
        ignoreBtn.on('pointerdown', () => this.nextChapter(false));
    }

    nextChapter(savedVillagers) {
        this.scene.start(SCENES.VOLCANO, {
            playerType: this.playerType,
            shards: this.shards + 1,
            savedVillagers: savedVillagers
        });
    }
}