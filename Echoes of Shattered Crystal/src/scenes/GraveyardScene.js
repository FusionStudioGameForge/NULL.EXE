// src/scenes/GraveyardScene.js
import { SCENES } from '../utils/constants.js';

export default class GraveyardScene extends Phaser.Scene {
    constructor() {
        super(SCENES.GRAVEYARD);
    }

    init(data) {
        this.playerType = data.playerType;
        this.shards = data.shards || 2;
        this.abilities = data.abilities || [];
    }

    create() {
        this.add.text(640, 60, "Chapter 3 - The Dead Man's Elm", { fontSize: '36px' }).setOrigin(0.5);

        const saveBtn = this.add.text(400, 380, 'SAVE THE VILLAGERS\n(Gain allies later)', {
            fontSize: '28px', fill: '#0f0', align: 'center'
        }).setOrigin(0.5).setInteractive();

        const ignoreBtn = this.add.text(880, 380, 'IGNORE THEM\n(Gain more power)', {
            fontSize: '28px', fill: '#f00', align: 'center'
        }).setOrigin(0.5).setInteractive();

        saveBtn.on('pointerdown', () => this.nextChapter(true));
        ignoreBtn.on('pointerdown', () => this.nextChapter(false));
    }

    nextChapter(saved) {
        this.scene.start(SCENES.VOLCANO, {
            playerType: this.playerType,
            shards: this.shards + 1,
            abilities: [...this.abilities, 'shield'],
            savedVillagers: saved
        });
    }
}