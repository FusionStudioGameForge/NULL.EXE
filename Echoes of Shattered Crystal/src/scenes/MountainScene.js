// src/scenes/MountainScene.js - Chapter 5 Final
import { SCENES } from '../utils/constants.js';

export default class MountainScene extends Phaser.Scene {
    constructor() {
        super(SCENES.MOUNTAIN);
    }

    init(data) {
        this.playerType = data.playerType;
        this.shards = data.shards || 4;
    }

    create() {
        this.add.image(640, 360, 'mountain_bg').setScale(1.1);

        this.add.text(640, 60, 'CHAPTER 5 - The Final Mountain', {
            fontSize: '36px',
            fill: '#ff4444'
        }).setOrigin(0.5);

        this.add.text(640, 250, 'Defeat the Dragon!\nPress SPACE to simulate victory', {
            fontSize: '26px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => this.showEndingChoice());
    }

    showEndingChoice() {
        const goodBtn = this.add.text(400, 420, 'RESTORE PEACE', {
            fontSize: '32px', fill: '#00ffff'
        }).setOrigin(0.5).setInteractive();

        const badBtn = this.add.text(880, 420, 'KEEP THE POWER', {
            fontSize: '32px', fill: '#ff00ff'
        }).setOrigin(0.5).setInteractive();

        goodBtn.on('pointerdown', () => this.showEnding('good'));
        badBtn.on('pointerdown', () => this.showEnding('bad'));
    }

    showEnding(type) {
        const message = type === 'good' 
            ? 'Peace is restored!\nThe land is saved.' 
            : 'You absorbed the crystal...\nYou are now the new dark ruler.';

        alert(message);
        this.scene.start(SCENES.MENU);
    }
}