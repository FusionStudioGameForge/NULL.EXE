// src/scenes/MenuScene.js
// =============================================
// Title / Main Menu Screen
// =============================================

import { SCENES } from '../utils/constants.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super(SCENES.MENU);
    }

    create() {
        this.cameras.main.setBackgroundColor('#0a0a1f');

        this.add.text(640, 180, 'ECHOES OF THE SHATTERED CRYSTAL', {
            fontSize: '52px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(640, 260, 'A Hackathon Project', {
            fontSize: '24px',
            fill: '#aaaaaa'
        }).setOrigin(0.5);

        const startBtn = this.add.text(640, 420, 'START JOURNEY', {
            fontSize: '42px',
            fill: '#00ff88'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        startBtn.on('pointerdown', () => {
            this.scene.start(SCENES.CHARACTER_SELECT);
        });
    }
}