// src/scenes/VictoryScene.js
// =============================================
// Shows either the GOOD or DARK ending
// with full narrative, score, and replay option
// =============================================

import { SCENES, COLORS } from '../utils/constants.js';

export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super(SCENES.VICTORY);
    }

    init(data) {
        this.playerType     = data.playerType     || 'orion';
        this.endingType     = data.endingType     || 'good';
        this.savedVillagers = data.savedVillagers || false;
        this.score          = data.score          || 0;
    }

    create() {
        this.cameras.main.fadeIn(1200, 0, 0, 0);
        const isGood = this.endingType === 'good';

        // ── Background tint ──────────────────────────────────────
        this.add.rectangle(640, 360, 1280, 720,
            isGood ? 0x001133 : 0x110000, 1);

        // ── Ending title ─────────────────────────────────────────
        const titleColor = isGood ? COLORS.CYAN : COLORS.PURPLE;
        const titleText  = isGood ? '✦  PEACE RESTORED  ✦' : '💀  DARKNESS REIGNS  💀';

        const title = this.add.text(640, 100, titleText, {
            fontSize: '52px', fill: titleColor,
            stroke: '#000000', strokeThickness: 6,
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: title, alpha: 1, duration: 1200, delay: 300 });

        // ── Ending text ──────────────────────────────────────────
        const narrative = isGood
            ? `${this.playerType === 'aria' ? 'Aria' : 'Orion'} plunged the completed crystal into the earth.\n\nThe dark curse shattered. The land breathed again.\nVillages were rebuilt. The skies cleared.\n\nThe hunter walked away with nothing —\nexcept the gratitude of every soul they had saved.`
            : `${this.playerType === 'aria' ? 'Aria' : 'Orion'} raised the crystal high and absorbed its power.\n\nThe curse did not break — it transferred.\nThe hunter\'s eyes turned crystal-cold.\n\nThe land had a new master now.\nNot a healer. Not a destroyer.\nSomething worse — a ruler without mercy.`;

        const story = this.add.text(640, 300, narrative, {
            fontSize: '20px', fill: COLORS.WHITE,
            align: 'center', lineSpacing: 8,
            wordWrap: { width: 900 },
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: story, alpha: 1, duration: 1200, delay: 1000 });

        // ── Stats ────────────────────────────────────────────────
        const stats = [
            `Hunter: ${this.playerType === 'aria' ? 'Aria' : 'Orion'}`,
            `Ending: ${isGood ? 'Restore Peace' : 'Keep Power'}`,
            `Villagers: ${this.savedVillagers ? 'Saved ✓' : 'Abandoned ✗'}`,
            `Score: ${this.score.toLocaleString()}`,
        ].join('     ');

        const statsText = this.add.text(640, 540, stats, {
            fontSize: '18px', fill: COLORS.GOLD,
        }).setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: statsText, alpha: 1, duration: 800, delay: 1800 });

        // ── Buttons ──────────────────────────────────────────────
        const replayBtn = this._buildBtn(500, 630, 'PLAY AGAIN', COLORS.CYAN, () => {
            this.cameras.main.fadeOut(600, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(SCENES.MENU));
        });
        const otherBtn = this._buildBtn(780, 630, 'SEE OTHER ENDING', COLORS.ORANGE, () => {
            this.cameras.main.fadeOut(600, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(SCENES.CHARACTER_SELECT));
        });

        // Fade in buttons
        [replayBtn, otherBtn].forEach((b, i) => {
            b.setAlpha(0);
            this.tweens.add({ targets: b, alpha: 1, duration: 600, delay: 2400 + i * 200 });
        });

        // Particle rain (gold for good, dark sparks for bad)
        this._spawnEndingParticles(isGood);
    }

    _buildBtn(x, y, label, color, onClick) {
        const btn = this.add.text(x, y, label, {
            fontSize: '22px', fill: '#000000',
            backgroundColor: color,
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => btn.setAlpha(0.8));
        btn.on('pointerout',  () => btn.setAlpha(1));
        btn.on('pointerdown', onClick);
        return btn;
    }

    _spawnEndingParticles(isGood) {
        const count = 30;
        for (let i = 0; i < count; i++) {
            const x = Phaser.Math.Between(0, 1280);
            const y = Phaser.Math.Between(-20, 100);
            const color = isGood
                ? Phaser.Display.Color.GetColor(
                    Phaser.Math.Between(200, 255),
                    Phaser.Math.Between(180, 230),
                    Phaser.Math.Between(50, 100)
                  )
                : Phaser.Display.Color.GetColor(
                    Phaser.Math.Between(100, 180),
                    0,
                    Phaser.Math.Between(100, 200)
                  );
            const p = this.add.circle(x, y, Phaser.Math.Between(2, 6), color, 0.8);
            this.tweens.add({
                targets: p,
                y: y + Phaser.Math.Between(400, 800),
                x: x + Phaser.Math.Between(-60, 60),
                alpha: 0,
                duration: Phaser.Math.Between(2000, 5000),
                delay: Phaser.Math.Between(0, 2000),
                repeat: -1,
                repeatDelay: Phaser.Math.Between(500, 2000),
            });
        }
    }
}


// =============================================
// GameOverScene
// =============================================

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.playerType = data.playerType || 'orion';
    }

    create() {
        this.cameras.main.fadeIn(600, 0, 0, 0);
        this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.9);

        this.add.text(640, 200, 'YOU HAVE FALLEN', {
            fontSize: '60px', fill: COLORS.RED,
            stroke: '#000000', strokeThickness: 6,
        }).setOrigin(0.5);

        this.add.text(640, 320, 'The curse spreads unchecked…\nThe land falls into eternal darkness.', {
            fontSize: '24px', fill: COLORS.WHITE,
            align: 'center', lineSpacing: 10,
        }).setOrigin(0.5);

        // Retry
        const retry = this.add.text(640, 500, 'TRY AGAIN', {
            fontSize: '32px', fill: '#000000',
            backgroundColor: COLORS.RED,
            padding: { x: 24, y: 12 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        retry.on('pointerover', () => retry.setAlpha(0.85));
        retry.on('pointerout',  () => retry.setAlpha(1));
        retry.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('CharacterSelectScene');
            });
        });

        const menu = this.add.text(640, 580, 'MAIN MENU', {
            fontSize: '22px', fill: COLORS.WHITE,
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        menu.on('pointerover', () => menu.setStyle({ fill: COLORS.CYAN }));
        menu.on('pointerout',  () => menu.setStyle({ fill: COLORS.WHITE }));
        menu.on('pointerdown', () => this.scene.start('MenuScene'));
    }
}
