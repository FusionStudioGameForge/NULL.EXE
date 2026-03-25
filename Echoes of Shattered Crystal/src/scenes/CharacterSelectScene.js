// src/scenes/CharacterSelectScene.js
// =============================================
// Player chooses between Aria (Archer) or Orion (Swordsman)
// This choice is passed to all future levels
// =============================================

import { SCENES, PLAYER } from '../utils/constants.js';

export default class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super(SCENES.CHARACTER_SELECT);
    }

    create() {
        this.add.text(640, 100, 'CHOOSE YOUR HUNTER', {
            fontSize: '48px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Aria Option
        this.add.text(400, 250, 'ARIA\nThe Skilled Archer', {
            fontSize: '32px',
            fill: '#00ffff',
            align: 'center'
        }).setOrigin(0.5);

        const ariaBtn = this.add.rectangle(400, 380, 200, 240, 0x00ffff, 0.2).setInteractive();
        ariaBtn.on('pointerdown', () => {
            this.scene.start(SCENES.VILLAGE, { playerType: PLAYER.ARIA });
        });

        // Orion Option
        this.add.text(880, 250, 'ORION\nThe Brave Swordsman', {
            fontSize: '32px',
            fill: '#ff8800',
            align: 'center'
        }).setOrigin(0.5);

        const orionBtn = this.add.rectangle(880, 380, 200, 240, 0xff8800, 0.2).setInteractive();
        orionBtn.on('pointerdown', () => {
            this.scene.start(SCENES.VILLAGE, { playerType: PLAYER.ORION });
        });
    }
}