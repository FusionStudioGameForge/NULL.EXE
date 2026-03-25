// src/scenes/ForestScene.js
// =============================================
// CHAPTER 2 – Forest of Whispers
// Enemies: shadow wolves + cursed guardian boss
// Unlocks: Speed Attack (Orion) / Rapid Shot (Aria)
// =============================================

import { SCENES, ENEMIES, COLORS, GAME } from '../utils/constants.js';
import Player from '../classes/Player.js';
import Enemy  from '../classes/Enemy.js';

const INTRO_LINES = [
    { text: 'The Forest of Whispers…',                        color: COLORS.GREEN  },
    { text: 'Shadow beasts stalk between the trees.',         color: COLORS.PURPLE },
    { text: 'Spirits whisper warnings in the dark.',          color: COLORS.WHITE  },
    { text: 'Stay sharp — the guardian is near.',             color: COLORS.RED    },
];

const ABILITY_LINES = (isAria) => [
    { speaker: 'Wise Man', text: '"The forest\'s energy flows into you…"' },
    { speaker: isAria ? 'Aria' : 'Orion',
      text: isAria
        ? '"I can feel it — Rapid Shot unlocked!"'
        : '"My strikes are faster now — Speed Attack unlocked!"',
      color: COLORS.CYAN },
];

export default class ForestScene extends Phaser.Scene {
    constructor() {
        super(SCENES.FOREST);
    }

    init(data) {
        this.playerType     = data.playerType    || 'orion';
        this.shards         = data.shards        || 1;
        this.savedVillagers = data.savedVillagers || false;
    }

    create() {
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this._phase      = 'intro';
        this._enemies    = [];
        this._bossSpawned = false;

        // ── World ────────────────────────────────────────────────
        this.add.image(640, 360, 'forest_bg').setDisplaySize(1280, 720);

        // Dark overlay — forest is gloomy
        this.add.rectangle(640, 360, 1280, 720, 0x001100, 0.35);

        // Ground
        this.ground = this.physics.add.staticGroup();
        const g = this.ground.create(640, GAME.GROUND_Y + 20, null);
        g.setVisible(false).setSize(1280, 40).refreshBody();

        // ── HUD ──────────────────────────────────────────────────
        this._buildHUD();

        // ── Shard sprite ─────────────────────────────────────────
        this.shardSprite = this.add.image(700, GAME.GROUND_Y - 30, 'shard')
            .setScale(1.5).setAlpha(0).setDepth(15);

        // ── Player ───────────────────────────────────────────────
        this.player = new Player(this, 150, GAME.GROUND_Y - 60, this.playerType);
        this.physics.add.collider(this.player, this.ground);
        this.player.on('meleeHit', (hx, hy) => this._checkMeleeHit(hx, hy));
        this.player.on('ultimate', (x, y)   => this._triggerUltimate(x, y));

        // ── Enemy group ──────────────────────────────────────────
        this.enemyGroup = this.physics.add.group();
        this.physics.add.collider(this.enemyGroup, this.ground);
        this.physics.add.overlap(this.player.projectiles, this.enemyGroup,
            (arrow, enemy) => {
                if (enemy.isAlive) { enemy.takeDamage(this.player.attackDmg); arrow.destroy(); }
            }
        );

        this.time.delayedCall(600, () => this._runIntro());
    }

    _buildHUD() {
        this.add.text(640, 20, 'CHAPTER 2 — Forest of Whispers', {
            fontSize: '22px', fill: COLORS.GREEN,
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

        this.waveTxt = this.add.text(640, 50, '', {
            fontSize: '18px', fill: COLORS.WHITE,
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

        this.shardTxt = this.add.text(1250, 20, `Shards: ${this.shards}`, {
            fontSize: '18px', fill: COLORS.CYAN,
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(50);
    }

    _runIntro() {
        this._showNarrativeLines(INTRO_LINES, () => {
            this._phase = 'fight';
            this._spawnForestWaves();
        });
    }

    _spawnForestWaves() {
        // Wave 1: wolves
        this.waveTxt.setText('Survive the shadow wolves!');
        const wolves = [
            { ...ENEMIES.WOLF, spawnX: 900  },
            { ...ENEMIES.WOLF, spawnX: 1050 },
            { ...ENEMIES.WOLF, spawnX: 1180 },
        ];
        wolves.forEach((cfg, i) => {
            this.time.delayedCall(i * 500, () => this._spawnEnemy(cfg));
        });

        this._aliveCount = wolves.length;
    }

    _spawnEnemy(cfg, isBoss = false) {
        const e = new Enemy(this, cfg.spawnX, GAME.GROUND_Y - 60, cfg);
        if (isBoss) {
            e.setScale(2);
            e.setDepth(9);
        }
        this.enemyGroup.add(e);
        this._enemies.push(e);

        e.on('died', (dead) => {
            this._enemies = this._enemies.filter(x => x !== dead);
            this._aliveCount = Math.max(0, this._aliveCount - 1);

            if (!this._bossSpawned && this._aliveCount === 0) {
                // All wolves cleared → spawn guardian boss
                this._spawnGuardian();
            } else if (this._bossSpawned && this._aliveCount === 0) {
                this._onFightComplete();
            }
        });

        this.physics.add.overlap(this.player.projectiles, e,
            (arrow, enemy) => {
                if (enemy.isAlive) { enemy.takeDamage(this.player.attackDmg); arrow.destroy(); }
            }
        );
        this.physics.add.overlap(this.player, e, () => {
            if (this.player.isAlive && e.isAlive && !this.player.isDashing)
                this.player.takeDamage(1);
        });
    }

    _spawnGuardian() {
        this._bossSpawned = true;
        this._aliveCount  = 1;

        // Boss announcement
        const ann = this.add.text(640, 300, '⚠  CURSED GUARDIAN  ⚠', {
            fontSize: '42px', fill: COLORS.PURPLE,
            stroke: '#000000', strokeThickness: 5,
        }).setOrigin(0.5).setDepth(55);
        this.time.delayedCall(1800, () => ann.destroy());

        this.waveTxt.setText('BOSS: Cursed Forest Guardian');

        this.time.delayedCall(1000, () => {
            this._spawnEnemy({
                ...ENEMIES.SHADOW_BEAST,
                health: 180,
                damage: 18,
                speed: 100,
                spawnX: 1100,
            }, true);
        });
    }

    _checkMeleeHit(hx, hy) {
        this._enemies.forEach(e => {
            if (!e.isAlive) return;
            const dist = Phaser.Math.Distance.Between(hx, hy, e.x, e.y);
            if (dist < 90) e.takeDamage(this.player.attackDmg);
        });
    }

    _triggerUltimate(x, y) {
        const ring = this.add.circle(x, y, 10, 0x8844ff, 0.7).setDepth(30);
        this.tweens.add({
            targets: ring, radius: 300, alpha: 0, duration: 600,
            onComplete: () => ring.destroy(),
        });
        this._enemies.forEach(e => {
            if (!e.isAlive) return;
            const d = Phaser.Math.Distance.Between(x, y, e.x, e.y);
            if (d < 300) e.takeDamage(this.player.attackDmg * 2.5);
        });
    }

    _onFightComplete() {
        this._phase = 'cutscene';
        this.waveTxt.setText('');

        // Show shard
        this.shardSprite.setAlpha(1);
        this.tweens.add({
            targets: this.shardSprite, y: this.shardSprite.y - 10,
            duration: 800, yoyo: true, repeat: -1,
        });

        this.time.delayedCall(600, () => {
            // Unlock ability dialogue
            const isAria = this.playerType === 'aria';
            this._showNarrativeLines(ABILITY_LINES(isAria), () => {
                // Unlock
                this.player.unlockAbility(isAria ? 'rapid_shot' : 'speed_attack');

                // Banner
                const banner = this.add.text(640, 250,
                    `✦  ${isAria ? 'RAPID SHOT' : 'SPEED ATTACK'} UNLOCKED  ✦`, {
                        fontSize: '34px', fill: COLORS.GOLD,
                        stroke: '#000000', strokeThickness: 4,
                    }).setOrigin(0.5).setDepth(60);
                this.tweens.add({ targets: banner, alpha: 0, delay: 2000, duration: 500, onComplete: () => banner.destroy() });

                this.time.delayedCall(2600, () => this._collectShard());
            });
        });
    }

    _collectShard() {
        this.tweens.add({ targets: this.shardSprite, scaleX: 0, scaleY: 0, alpha: 0, duration: 500 });
        this.shards++;
        this.shardTxt.setText(`Shards: ${this.shards}`);

        const msg = this.add.text(640, 280, '✦  SHARD 2 COLLECTED  ✦', {
            fontSize: '36px', fill: COLORS.GOLD,
            stroke: '#000000', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(70);
        this.time.delayedCall(2000, () => {
            msg.destroy();
            this._showDialog(null,
                'The graveyard lies ahead… The Dead Man\'s Elm awaits.',
                COLORS.PURPLE,
                () => this._goToNextChapter()
            );
        });
    }

    _goToNextChapter() {
        this.cameras.main.fadeOut(700, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(SCENES.GRAVEYARD, {
                playerType: this.playerType,
                shards: this.shards,
                savedVillagers: this.savedVillagers,
            });
        });
    }

    _showDialog(speaker, text, color, onDone, duration = 2800) {
        if (this._dialogBox) this._dialogBox.destroy();
        const box = this.add.container(640, 630).setDepth(60);
        const bg  = this.add.rectangle(0, 0, 900, 90, 0x000000, 0.82).setStrokeStyle(1, 0x888888);
        const txt = this.add.text(0, speaker ? 10 : 0, text, {
            fontSize: '22px', fill: color || COLORS.WHITE,
            align: 'center', wordWrap: { width: 860 },
        }).setOrigin(0.5);
        const children = [bg, txt];
        if (speaker) {
            children.push(this.add.text(0, -30, speaker, {
                fontSize: '16px', fill: COLORS.GOLD, fontStyle: 'italic',
            }).setOrigin(0.5));
        }
        box.add(children);
        this._dialogBox = box;
        const advance = () => {
            if (this._dialogBox) { this._dialogBox.destroy(); this._dialogBox = null; }
            this.input.off('pointerdown', advance);
            onDone();
        };
        this.input.once('pointerdown', advance);
        this.time.delayedCall(duration, () => { if (this._dialogBox === box) advance(); });
    }

    _showNarrativeLines(lines, onComplete) {
        let i = 0;
        const showNext = () => {
            if (i >= lines.length) {
                if (this._dialogBox) { this._dialogBox.destroy(); this._dialogBox = null; }
                onComplete();
                return;
            }
            const line = lines[i++];
            this._showDialog(line.speaker || null, line.text, line.color, showNext, 2400);
        };
        showNext();
    }

    update() {
        if (this.player && this.player.isAlive) this.player.update();
        this._enemies.forEach(e => { if (e.active) e.update(); });
    }
}
