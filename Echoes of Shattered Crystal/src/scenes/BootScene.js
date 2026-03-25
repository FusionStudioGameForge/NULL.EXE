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

        this.load.image('volcanoe_bg',   'assets/images/backgrounds/volcanoe_bg.png');
 
        this.load.image('mountain_bg',  'assets/images/backgrounds/mountain_bg.png');
        this.load.image('menu_bg',      'assets/images/backgrounds/menu_bg.png');

        // ── Character sprite sheets ───────────────────
        // Expects: 64x64 frames, 18 columns (see Player.js for frame layout)
        this.load.spritesheet('aria',  'assets/images/characters/aria.png',  { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('orion', 'assets/images/characters/orion.png', { frameWidth: 64, frameHeight: 64 });

        // ── Enemy sprite sheets ───────────────────────
        this.load.spritesheet('bandit',       'assets/images/enemies/bandit.png',       { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('goblin',       'assets/images/enemies/goblin.png',       { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('wolf',         'assets/images/enemies/wolf.png',         { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('shadow_beast', 'assets/images/enemies/shadow_beast.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('skeleton',     'assets/images/enemies/skeleton.png',     { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('fire_skeleton','assets/images/enemies/fire_skeleton.png',{ frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('lava_beast',   'assets/images/enemies/lava_beast.png',   { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('dragon',       'assets/images/enemies/dragon.png',       { frameWidth: 128, frameHeight: 128 });

        // ── Projectiles & effects ─────────────────────
        this.load.image('arrow',       'assets/images/effects/arrow.png');
        this.load.image('shard',       'assets/images/effects/shard.png');
        this.load.image('crystal',     'assets/images/effects/crystal.png');
        this.load.image('particle',    'assets/images/effects/particle.png');
        this.load.image('shield_fx',   'assets/images/effects/shield_fx.png');

        // ── UI ────────────────────────────────────────
        this.load.image('health_bar_bg', 'assets/images/ui/health_bar_bg.png');
        this.load.image('health_bar_fg', 'assets/images/ui/health_bar_fg.png');
        this.load.image('ability_icon',  'assets/images/ui/ability_icon.png');

        // ── Audio ─────────────────────────────────────
        this.load.audio('hit_sword',  'assets/audio/hit_sword.mp3');
        this.load.audio('hit_arrow',  'assets/audio/hit_arrow.mp3');
        this.load.audio('enemy_death','assets/audio/enemy_death.mp3');
        this.load.audio('shard_pick', 'assets/audio/shard_pick.mp3');
        this.load.audio('ability_up', 'assets/audio/ability_up.mp3');
        this.load.audio('music_menu', 'assets/audio/music_menu.mp3');
        this.load.audio('music_battle','assets/audio/music_battle.mp3');
    }

    create() {
        this.scene.start(SCENES.MENU);
    }
}
