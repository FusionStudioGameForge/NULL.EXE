// src/scenes/MountainScene.js
import { SCENES } from '../utils/constants.js';

export default class MountainScene extends Phaser.Scene {
    constructor() {
        super(SCENES.MOUNTAIN);
    }

    init(data) {
        this.playerType = data.playerType;
        this.shards = data.shards || 4;
        this.abilities = data.abilities || [];
        this.savedVillagers = data.savedVillagers || false;
    }

    create() {
        this.add.text(640, 60, 'Chapter 5 - The Final Mountain', { fontSize: '36px' }).setOrigin(0.5);
        this.add.text(640, 220, 'Defeat the Dragon!\n(Press SPACE to simulate victory)', {
            fontSize: '26px', fill: '#f00', align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => this.showEndingChoice());
    }

    showEndingChoice() {
        const good = this.add.text(400, 420, 'RESTORE PEACE\n(Sacrifice powers)', {
            fontSize: '30px', fill: '#0ff', align: 'center'
        }).setOrigin(0.5).setInteractive();

        const bad = this.add.text(880, 420, 'KEEP THE POWER\n(Rule the land)', {
            fontSize: '30px', fill: '#f0f', align: 'center'
        }).setOrigin(0.5).setInteractive();

        good.on('pointerdown', () => this.endGame('good'));
        bad.on('pointerdown', () => this.endGame('bad'));
    }

    endGame(type) {
        alert(type === 'good' 
            ? 'Peace is restored! The land is saved.' 
            : 'You became the new dark ruler...');
        
        this.scene.start(SCENES.MENU);
    }
}