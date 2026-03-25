// src/scenes/VolcanoScene.js
// =============================================
// CHAPTER 4 – Volcano of Flames
// Enemies: fire skeletons + lava beast boss
// Unlocks: Dash ability
// Environmental hazard: lava damage zones
// =============================================

import { SCENES, ENEMIES, COLORS, GAME } from '../utils/constants.js';
import Player from '../classes/Player.js';
import Enemy  from '../classes/Enemy.js';

const INTRO_LINES = [
    { text: 'The Volcano of Flames — the air burns with every breath.', color: COLORS.ORANGE },
    { text: 'Fire skeletons patrol the lava rivers.',                   color: COLORS.RED    },
    { text: 'One wrong step means death.',                              color: COLORS.WHITE  },
    { text: 'The fourth shard lies deep within the volcano\'s heart.',  color: COLORS.GOLD   },
];

export default class VolcanoScene extends Phaser.Scene {
    constructor() {
        super(SCENES.VOLCANO);
    }

    init(data) {
        this.playerType     = data.playerType    || 'orion';
        this.shards         = data.shards        || 3;
        this.savedVillagers = data.savedVillagers || false;
    }

    create() {
<<<<<<< HEAD
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this._phase      = 'intro';
        this._enemies    = [];
        this._aliveCount = 0;
        this._bossSpawned = false;
=======
        this.add.image(640, 360, 'volcanoe_bg').setScale(1.1);
>>>>>>> fc6c5c897ee1617ee9a698e927be5862825f3a4c

        // ── World ────────────────────────────────────────────────
        this.add.image(640, 360, 'volcanoe_bg').setDisplaySize(1280, 720);
        // Heat shimmer overlay
        this.add.rectangle(640, 360, 1280, 720, 0x220800, 0.3);

        // Ground
        this.ground = this.physics.add.staticGroup();
        const g = this.ground.create(640, GAME.GROUND_Y + 20, null);
        g.setVisible(false).setSize(1280, 40).refreshBody();

        // ── Lava hazard zones ────────────────────────────────────
        this._buildLavaZones();

        // ── HUD ──────────────────────────────────────────────────
        this._buildHUD();

        // ── Shard ────────────────────────────────────────────────
        this.shardSprite = this.add.image(640, GAME.GROUND_Y - 30, 'shard')
            .setScale(1.5).setAlpha(0).setTint(0xff6600).setDepth(15);

        // ── Player ───────────────────────────────────────────────
        this.player = new Player(this, 150, GAME.GROUND_Y - 60, this.playerType);
        this.physics.add.collider(this.player, this.ground);
        this.player.on('meleeHit', (hx, hy) => this._checkMeleeHit(hx, hy));
        this.player.on('ultimate', (x, y)   => this._triggerUltimate(x, y));

        // Lava damage timer
        this._lavaTimer = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: this._checkLavaDamage,
            callbackScope: this,
        });

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

    _buildLavaZones() {
        const g = this.add.graphics().setDepth(3);
        // Two lava pit zones (visual)
        this._lavaRects = [
            new Phaser.Geom.Rectangle(400, GAME.GROUND_Y - 10, 150, 30),
            new Phaser.Geom.Rectangle(750, GAME.GROUND_Y - 10, 120, 30),
        ];
        this._lavaRects.forEach(r => {
            g.fillStyle(0xff4400, 0.85);
            g.fillRect(r.x, r.y, r.width, r.height);
            g.fillStyle(0xff8800, 0.5);
            g.fillRect(r.x + 10, r.y + 5, r.width - 20, 10);
        });

        // Pulse lava
        const lavaOverlay = this.add.rectangle(575, GAME.GROUND_Y, 400, 20, 0xff6600, 0.3).setDepth(4);
        this.tweens.add({ targets: lavaOverlay, alpha: 0.7, duration: 600, yoyo: true, repeat: -1 });

        this.add.text(550, GAME.GROUND_Y - 35, '⚠ LAVA', {
            fontSize: '14px', fill: '#ff4400',
        }).setOrigin(0.5).setDepth(5);
    }

    _checkLavaDamage() {
        if (!this.player || !this.player.isAlive) return;
        const px = this.player.x, py = this.player.y;
        this._lavaRects.forEach(r => {
            if (r.contains(px, py)) {
                this.player.takeDamage(8);
                this.cameras.main.flash(100, 255, 60, 0);
            }
        });
    }

    _buildHUD() {
        this.add.text(640, 20, 'CHAPTER 4 — Volcano of Flames', {
            fontSize: '22px', fill: COLORS.ORANGE,
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

        this.waveTxt = this.add.text(640, 50, '', {
            fontSize: '18px', fill: COLORS.WHITE,
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

        this.shardTxt = this.add.text(1250, 20, `Shards: ${this.shards}`, {
            fontSize: '18px', fill: COLORS.CYAN,
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(50);

        // Ally reminder
        if (this.savedVillagers) {
            this.add.text(640, 680, '★ Villager allies have weakened enemy defences by 15%', {
                fontSize: '15px', fill: COLORS.GREEN,
            }).setOrigin(0.5).setScrollFactor(0).setDepth(50);
        }
    }

    _runIntro() {
        this._showNarrativeLines(INTRO_LINES, () => {
            this._phase = 'fight';
            this._spawnWave1();
        });
    }

    _spawnWave1() {
        this.waveTxt.setText('Fire skeletons — wave 1!');
        const cfgs = [
            { ...ENEMIES.FIRE_SKELETON, spawnX: 900  },
            { ...ENEMIES.FIRE_SKELETON, spawnX: 1050 },
            { ...ENEMIES.FIRE_SKELETON, spawnX: 1200 },
        ];
        // Villager buff
        if (this.savedVillagers) cfgs.forEach(c => c.health = Math.floor(c.health * 0.85));

        this._aliveCount = cfgs.length;
        cfgs.forEach((cfg, i) => {
            this.time.delayedCall(i * 500, () => this._spawnEnemy(cfg));
        });
    }

    _spawnEnemy(cfg, isBoss = false) {
        const e = new Enemy(this, cfg.spawnX, GAME.GROUND_Y - 60, cfg);
        if (isBoss) { e.setScale(2.2); e.setDepth(9); }
        this.enemyGroup.add(e);
        this._enemies.push(e);

        e.on('died', (dead) => {
            this._enemies = this._enemies.filter(x => x !== dead);
            this._aliveCount = Math.max(0, this._aliveCount - 1);

            if (!this._bossSpawned && this._aliveCount === 0) {
                this._spawnLavaBoss();
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

    _spawnLavaBoss() {
        this._bossSpawned = true;
        this._aliveCount  = 1;

        const ann = this.add.text(640, 300, '🔥  LAVA BEAST  🔥', {
            fontSize: '48px', fill: COLORS.RED,
            stroke: '#000000', strokeThickness: 6,
        }).setOrigin(0.5).setDepth(55);
        this.cameras.main.flash(300, 255, 80, 0);
        this.time.delayedCall(1800, () => ann.destroy());
        this.waveTxt.setText('BOSS: The Lava Beast');

        this.time.delayedCall(1200, () => {
            const cfg = {
                ...ENEMIES.LAVA_BEAST,
                health: this.savedVillagers ? 100 : 120,
                spawnX: 1000,
            };
            this._spawnEnemy(cfg, true);
        });
    }

    _checkMeleeHit(hx, hy) {
        this._enemies.forEach(e => {
            if (!e.isAlive) return;
            if (Phaser.Math.Distance.Between(hx, hy, e.x, e.y) < 90)
                e.takeDamage(this.player.attackDmg);
        });
    }

    _triggerUltimate(x, y) {
        const ring = this.add.circle(x, y, 10, 0x8844ff, 0.7).setDepth(30);
        this.tweens.add({ targets: ring, radius: 300, alpha: 0, duration: 600, onComplete: () => ring.destroy() });
        this._enemies.forEach(e => {
            if (!e.isAlive) return;
            if (Phaser.Math.Distance.Between(x, y, e.x, e.y) < 300)
                e.takeDamage(this.player.attackDmg * 2.5);
        });
    }

    _onFightComplete() {
        this._phase = 'cutscene';
        if (this._lavaTimer) this._lavaTimer.destroy();
        this.waveTxt.setText('');

        this.player.unlockAbility('dash');

        const banner = this.add.text(640, 250, '✦  DASH UNLOCKED  ✦', {
            fontSize: '34px', fill: COLORS.CYAN,
            stroke: '#000000', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(60);
        this.add.text(640, 295, 'Press C to dash through enemies!', {
            fontSize: '18px', fill: COLORS.WHITE,
        }).setOrigin(0.5).setDepth(60);
        this.time.delayedCall(2800, () => banner.destroy());

        this.shardSprite.setAlpha(1);
        this.tweens.add({ targets: this.shardSprite, y: this.shardSprite.y - 10, duration: 800, yoyo: true, repeat: -1 });
        this.time.delayedCall(3200, () => this._collectShard());
    }

    _collectShard() {
        this.tweens.add({ targets: this.shardSprite, scaleX: 0, scaleY: 0, alpha: 0, duration: 500 });
        this.shards++;
        this.shardTxt.setText(`Shards: ${this.shards}`);

        const msg = this.add.text(640, 280, '✦  SHARD 4 COLLECTED  ✦', {
            fontSize: '36px', fill: COLORS.GOLD,
            stroke: '#000000', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(70);
        this.time.delayedCall(2000, () => {
            msg.destroy();
            this._showDialog(null,
                'One shard remains. The Final Mountain looms ahead…',
                COLORS.WHITE,
                () => this._goToNextChapter()
            );
        });
    }

    _goToNextChapter() {
        this.cameras.main.fadeOut(700, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(SCENES.MOUNTAIN, {
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
        const txt = this.add.text(0, speaker ? 10 : 0, text, { fontSize: '22px', fill: color || COLORS.WHITE, align: 'center', wordWrap: { width: 860 } }).setOrigin(0.5);
        const children = [bg, txt];
        if (speaker) children.push(this.add.text(0, -30, speaker, { fontSize: '16px', fill: COLORS.GOLD, fontStyle: 'italic' }).setOrigin(0.5));
        box.add(children);
        this._dialogBox = box;
        const advance = () => { if (this._dialogBox) { this._dialogBox.destroy(); this._dialogBox = null; } this.input.off('pointerdown', advance); onDone(); };
        this.input.once('pointerdown', advance);
        this.time.delayedCall(duration, () => { if (this._dialogBox === box) advance(); });
    }

    _showNarrativeLines(lines, onComplete) {
        let i = 0;
        const showNext = () => {
            if (i >= lines.length) { if (this._dialogBox) { this._dialogBox.destroy(); this._dialogBox = null; } onComplete(); return; }
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
