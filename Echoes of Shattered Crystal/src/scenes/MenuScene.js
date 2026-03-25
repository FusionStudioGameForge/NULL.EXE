// src/scenes/MenuScene.js
// =============================================
// Title screen / Main Menu
// Shows game title and lets player start the journey
// =============================================

import { SCENES } from '../utils/constants.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super(SCENES.MENU);
    }

    create() {
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Game Title
        this.add.text(640, 180, 'ECHOES OF THE SHATTERED CRYSTAL', {
            fontSize: '52px',
            fontStyle: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Subtitle / Story hint
        this.add.text(640, 260, 'A tale of shards, monsters, and destiny', {
            fontSize: '24px',
            fill: '#aaaaaa'
        }).setOrigin(0.5);

        // Start Button
        const startBtn = this.add.text(640, 420, 'BEGIN YOUR JOURNEY', {
            fontSize: '42px',
            fill: '#00ff88'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        startBtn.on('pointerdown', () => {
            this.scene.start(SCENES.CHARACTER_SELECT);
        });

        // Hackathon note
        this.add.text(640, 620, 'Hackathon Demo - Press F12 for console logs', {
            fontSize: '18px',
            fill: '#666666'
        }).setOrigin(0.5);
    }
}