// src/scenes/MountainScene.js
// Chapter 5: The Final Mountain
// Final boss + twist ending choice
// =============================================

import { SCENES } from '../utils/constants.js';

export default class MountainScene extends Phaser.Scene {
    constructor() {
        super(SCENES.MOUNTAIN);
    }

    init(data) {
        this.playerType = data.playerType;
        this.shardsCollected = data.shardsCollected || 4;
        this.savedVillagers = data.savedVillagers || false;
    }

    create() {
        this.add.text(640, 60, 'CHAPTER 5 - The Final Mountain', { fontSize: '36px' }).setOrigin(0.5);
        this.add.text(640, 220, 'The Dragon awaits...\nPress SPACE to simulate final battle', {
            fontSize: '26px',
            fill: '#ff0000',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => this.showEndingChoice());
    }

    showEndingChoice() {
        const goodBtn = this.add.text(400, 420, 'RESTORE PEACE\n(Sacrifice your powers)', {
            fontSize: '28px', fill: '#00ffff', align: 'center'
        }).setOrigin(0.5).setInteractive();

        const badBtn = this.add.text(880, 420, 'KEEP THE POWER\n(Became the new ruler)', {
            fontSize: '28px', fill: '#ff00ff', align: 'center'
        }).setOrigin(0.5).setInteractive();

        goodBtn.on('pointerdown', () => this.showEnding('good'));
        badBtn.on('pointerdown', () => this.showEnding('bad'));
    }

    showEnding(type) {
        const message = type === 'good' 
            ? 'Peace is restored!\nThe land is saved.' 
            : 'You absorbed the crystal...\nYou are the new dark ruler.';

        alert(message);   // Simple ending for hackathon demo
        this.scene.start(SCENES.MENU);
    }
}