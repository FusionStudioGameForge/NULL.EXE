// src/scenes/MenuScene.js
// =============================================
// Main menu with animated title and intro text
// =============================================

import { SCENES, COLORS } from '../utils/constants.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super(SCENES.MENU);
    }

    create() {
        // Background
        const bg = this.add.image(640, 360, 'menu_bg').setDisplaySize(1280, 720);

        // Dark overlay
        this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.55);

        // Crystal glow effect (pulsing circle)
        const glow = this.add.circle(640, 200, 80, 0x88ccff, 0.3);
        this.tweens.add({
            targets: glow,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0.6,
            duration: 1200,
            yoyo: true,
            repeat: -1,
        });

        // Title
        this.add.text(640, 160, 'ECHOES OF THE', {
            fontSize: '32px', fill: COLORS.CYAN, fontStyle: 'italic'
        }).setOrigin(0.5);

        const title = this.add.text(640, 220, 'SHATTERED CRYSTAL', {
            fontSize: '64px', fill: COLORS.GOLD,
            stroke: '#000000', strokeThickness: 6,
        }).setOrigin(0.5);

        // Flicker title
        this.tweens.add({
            targets: title,
            alpha: 0.85,
            duration: 2000,
            yoyo: true,
            repeat: -1,
        });

        // Lore intro
        this.add.text(640, 340,
            'The sacred crystal has shattered.\nDarkness spreads across the land.\nA hunter must rise.',
            {
                fontSize: '22px', fill: COLORS.WHITE,
                align: 'center', lineSpacing: 8,
            }
        ).setOrigin(0.5);

        // Start button
        const startBtn = this.add.text(640, 480, '▶  BEGIN YOUR JOURNEY', {
            fontSize: '32px', fill: COLORS.WHITE,
            backgroundColor: '#333333',
            padding: { x: 24, y: 12 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        startBtn.on('pointerover', () => startBtn.setStyle({ fill: COLORS.GOLD }));
        startBtn.on('pointerout',  () => startBtn.setStyle({ fill: COLORS.WHITE }));
        startBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(600, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(SCENES.CHARACTER_SELECT);
            });
        });

        // Version
        this.add.text(1260, 710, 'v1.0', {
            fontSize: '14px', fill: '#888888'
        }).setOrigin(1, 1);

        // Music
        // this.sound.play('music_menu', { loop: true, volume: 0.5 });

        // Fade in
        this.cameras.main.fadeIn(800, 0, 0, 0);
    }
}
