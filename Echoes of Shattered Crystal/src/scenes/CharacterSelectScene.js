// src/scenes/CharacterSelectScene.js
// =============================================
// Player chooses Aria (archer) or Orion (swordsman)
// Shows stats, lore, and animated preview
// =============================================

import { SCENES, PLAYER, COLORS } from '../utils/constants.js';

export default class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super(SCENES.CHARACTER_SELECT);
    }

    create() {
        this.cameras.main.fadeIn(600, 0, 0, 0);

        // Background
        this.add.image(640, 360, 'village_bg').setDisplaySize(1280, 720);
        this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.65);

        // Title
        this.add.text(640, 60, 'CHOOSE YOUR HUNTER', {
            fontSize: '48px', fill: COLORS.GOLD,
            stroke: '#000000', strokeThickness: 5,
        }).setOrigin(0.5);

        this.add.text(640, 115, 'Your choice shapes your combat style throughout the journey', {
            fontSize: '20px', fill: COLORS.WHITE,
        }).setOrigin(0.5);

        // Divider
        this.add.line(640, 145, -580, 0, 580, 0, 0xffffff, 0.3);

        this._buildCard(320, PLAYER.ARIA,  'aria');
        this._buildCard(960, PLAYER.ORION, 'orion');

        // Back button
        const back = this.add.text(80, 40, '← BACK', {
            fontSize: '20px', fill: COLORS.WHITE,
        }).setInteractive({ useHandCursor: true });
        back.on('pointerover', () => back.setStyle({ fill: COLORS.CYAN }));
        back.on('pointerout',  () => back.setStyle({ fill: COLORS.WHITE }));
        back.on('pointerdown', () => this.scene.start(SCENES.MENU));
    }

    _buildCard(cx, config, type) {
        const isAria  = type === 'aria';
        const accent  = isAria ? 0x00ccff : 0xff8800;
        const accentH = isAria ? COLORS.CYAN : COLORS.ORANGE;

        // Card background
        const card = this.add.rectangle(cx, 400, 520, 550, 0x111122, 0.85)
            .setStrokeStyle(2, accent, 0.8);

        // Character sprite preview (animated if spritesheet loaded)
        const preview = this.add.sprite(cx, 260, type);
        preview.setScale(3.5);
        // Play idle if animation exists; fallback to static frame
        try { preview.play(`${type}_idle`); } catch(e) { preview.setFrame(0); }

        // Hover glow
        const glow = this.add.circle(cx, 260, 85, accent, 0.12);

        // Name
        this.add.text(cx, 390, config.name, {
            fontSize: '40px', fill: accentH,
            stroke: '#000000', strokeThickness: 4,
        }).setOrigin(0.5);

        this.add.text(cx, 435, config.title, {
            fontSize: '20px', fill: COLORS.WHITE, fontStyle: 'italic',
        }).setOrigin(0.5);

        // Divider
        this.add.line(cx, 458, -180, 0, 180, 0, accent, 0.5);

        // Stats
        const stats = [
            { label: 'Weapon',  value: isAria ? 'Bow & Arrow' : 'Sword' },
            { label: 'Style',   value: isAria ? 'Fast, ranged' : 'Close combat' },
            { label: 'Health',  value: `${config.health} HP` },
            { label: 'Damage',  value: `${config.attackDamage} per hit` },
            { label: 'Speed',   value: isAria ? '★★★★☆' : '★★★☆☆' },
            { label: 'Strength',value: isAria ? '★★★☆☆' : '★★★★☆' },
        ];

        stats.forEach((s, i) => {
            const y = 478 + i * 28;
            this.add.text(cx - 160, y, `${s.label}:`, {
                fontSize: '17px', fill: '#aaaaaa',
            });
            this.add.text(cx + 160, y, s.value, {
                fontSize: '17px', fill: COLORS.WHITE,
            }).setOrigin(1, 0);
        });

        // Select button
        const btn = this.add.text(cx, 660, `PLAY AS ${config.name.toUpperCase()}`, {
            fontSize: '24px', fill: '#000000',
            backgroundColor: accentH,
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => {
            btn.setAlpha(0.85);
            glow.setAlpha(0.3);
            card.setStrokeStyle(3, accent, 1);
        });
        btn.on('pointerout', () => {
            btn.setAlpha(1);
            glow.setAlpha(0.12);
            card.setStrokeStyle(2, accent, 0.8);
        });
        btn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(SCENES.VILLAGE, { playerType: type, shards: 0, savedVillagers: false });
            });
        });
    }
}
