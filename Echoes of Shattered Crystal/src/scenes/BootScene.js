// src/scenes/BootScene.js
// =============================================
// First scene — loads ALL game assets
// =============================================

import { SCENES } from '../utils/constants.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super(SCENES.BOOT);
    }

    preload() {
        // ── Progress bar ──────────────────────────────
        const bar  = this.add.graphics();
        const box  = this.add.graphics();
        box.fillStyle(0x222222, 0.8);
        box.fillRect(240, 330, 800, 40);

        this.load.on('progress', (v) => {
            bar.clear();
            bar.fillStyle(0x00ffcc, 1);
            bar.fillRect(240, 330, 800 * v, 40);
        });

        this.add.text(640, 300, 'Loading…', {
            fontSize: '28px', fill: '#ffffff'
        }).setOrigin(0.5);

        // ── Backgrounds ───────────────────────────────
        this.load.image('village_bg',   'assets/images/backgrounds/village_bg.png');
        this.load.image('forest_bg',    'assets/images/backgrounds/forest_bg.png');
        this.load.image('graveyard_bg', 'assets/images/backgrounds/graveyard_bg.png');
        this.load.image('volcanoe_bg',  'assets/images/backgrounds/volcanoe_bg.png');
        this.load.image('mountain_bg',  'assets/images/backgrounds/mountain_bg.png');


        // ── Character sprite sheets ───────────────────
        // Expects: 64x64 frames, 18 columns (see Player.js for frame layout)
        this.load.spritesheet('aria',  'assets/images/characters/aria.png',  { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('orion', 'assets/images/characters/orion.png', { frameWidth: 64, frameHeight: 64 });

        // ── Enemy sprite sheets ───────────────────────

        this.load.spritesheet('goblin','assets/images/characters/goblinsword.png',       { frameWidth: 64, frameHeight: 64 });


        // ── Projectiles & effects ─────────────────────
        this.load.image('projectile','assets/images/characters/projectile.png');


        // ── UI ────────────────────────────────────────
        this.load.image('health_bar_bg', 'assets/images/ui/health_bar_bg.png');
        this.load.image('health_bar_fg', 'assets/images/ui/health_bar_fg.png');
        this.load.image('powerup',  'assets/images/ui/powerup.jpeg');

        // ── Audio ─────────────────────────────────────
        this.load.audio('hit_sword',  'assets/audio/mixkit-dagger-woosh-1487.wav');
        this.load.audio('hit_arrow',  'assets/audio/mixkit-dagger-woosh-1487.wav');
        this.load.audio('music_battle','assets/audio/charlvera-siege-of-the-ancients-instrumental-background-music-for-video-190671.mp3');
    }

    create() {
        this.scene.start(SCENES.MENU);
    }
}
