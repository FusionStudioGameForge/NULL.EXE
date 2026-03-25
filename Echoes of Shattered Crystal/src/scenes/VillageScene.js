// src/scenes/VillageScene.js
// =============================================
// CHAPTER 1 – Village of Shadows
// Full demo fight: wave of bandits + goblins
// Wise Man cutscene → first shard collected
// =============================================

import { SCENES, ENEMIES, COLORS, GAME } from '../utils/constants.js';
import Player from '../classes/Player.js';
import Enemy  from '../classes/Enemy.js';

// ── Narrative sequences ───────────────────────────────────────────────────────
const INTRO_LINES = [
    { text: 'The sacred crystal… it shatters!',               color: COLORS.GOLD   },
    { text: 'A dark curse spreads across the village…',        color: COLORS.PURPLE },
    { text: 'Monsters emerge from the shadows!',               color: COLORS.RED    },
    { text: 'Defend the village!',                             color: COLORS.WHITE  },
];

const WISE_MAN_LINES = [
    { speaker: 'Wise Man', text: '"The crystal\'s power has been split into five shards…"' },
    { speaker: 'Wise Man', text: '"Each shard lies in a cursed land, guarded by darkness."' },
    { speaker: 'Wise Man', text: '"Seek them across the cursed lands…"' },
    { speaker: 'Wise Man', text: '"Only then can balance be restored."' },
];

export default class VillageScene extends Phaser.Scene {
    constructor() {
        super(SCENES.VILLAGE);
    }

    // ── Init ─────────────────────────────────────────────────────────────────
    init(data) {
        this.playerType    = data.playerType || 'orion';
        this.shards        = data.shards     || 0;
        this.savedVillagers = false;
    }

    // ── Create ───────────────────────────────────────────────────────────────
    create() {
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this._phase     = 'intro';   // intro → fight → cutscene → complete
        this._enemies   = [];
        this._wave      = 0;
        this._dialogBox = null;

        // ── World ────────────────────────────────────────────────
        this.add.image(640, 360, 'village_bg').setDisplaySize(1280, 720);

        // Ground platform
        this.ground = this.physics.add.staticGroup();
        const g = this.ground.create(640, GAME.GROUND_Y + 20, null);
        g.setVisible(false);
        g.setSize(1280, 40);
        g.refreshBody();

        // Scenery rocks/ruins (visual only)
        this._drawScenery();

        // ── Crystal shard on ground (hidden until fight done) ────
        this.shardSprite = this.add.image(640, GAME.GROUND_Y - 30, 'shard')
            .setScale(1.5).setAlpha(0).setDepth(15);

        // ── HUD ──────────────────────────────────────────────────
        this._buildHUD();

        // ── Player ───────────────────────────────────────────────
        this.player = new Player(this, 200, GAME.GROUND_Y - 60, this.playerType);
        this.physics.add.collider(this.player, this.ground);

        // Melee hit event from Player
        this.player.on('meleeHit', (hx, hy) => this._checkMeleeHit(hx, hy));
        this.player.on('ultimate', (x, y)   => this._triggerUltimate(x, y));

        // ── Enemy group ──────────────────────────────────────────
        this.enemyGroup = this.physics.add.group();
        this.physics.add.collider(this.enemyGroup, this.ground);

        // Arrow vs enemy collider
        this.physics.add.overlap(this.player.projectiles, this.enemyGroup,
            (arrow, enemy) => {
                if (enemy.isAlive) enemy.takeDamage(this.player.attackDmg);
                arrow.destroy();
            }
        );

        // ── Start intro sequence ─────────────────────────────────
        this.time.delayedCall(600, () => this._runIntro());
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  SCENERY (placeholder boxes until real art loads)
    // ─────────────────────────────────────────────────────────────────────────
    _drawScenery() {
        const g = this.add.graphics();
        g.setDepth(1);
        // Ruined walls
        g.fillStyle(0x553322, 0.7);
        g.fillRect(50, 480, 120, 100);
        g.fillRect(1100, 490, 100, 90);
        g.fillStyle(0x332211, 0.5);
        g.fillRect(900, 510, 80, 70);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  HUD
    // ─────────────────────────────────────────────────────────────────────────
    _buildHUD() {
        // Chapter title
        this.add.text(640, 20, 'CHAPTER 1 — Village of Shadows', {
            fontSize: '22px', fill: COLORS.GOLD,
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

        // Wave counter
        this.waveTxt = this.add.text(640, 50, '', {
            fontSize: '18px', fill: COLORS.WHITE,
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

        // Shard counter
        this.shardTxt = this.add.text(1250, 20, `Shards: ${this.shards}`, {
            fontSize: '18px', fill: COLORS.CYAN,
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(50);

        // Score
        this.scoreTxt = this.add.text(1250, 44, 'Score: 0', {
            fontSize: '16px', fill: COLORS.WHITE,
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(50);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  INTRO SEQUENCE
    // ─────────────────────────────────────────────────────────────────────────
    _runIntro() {
        this._showNarrativeLines(INTRO_LINES, () => {
            this._phase = 'fight';
            this._spawnWave(1);
        });
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
            this._showDialog(
                line.speaker || null,
                line.text || line,
                line.color || COLORS.WHITE,
                showNext,
                2400
            );
        };
        showNext();
    }

    _showDialog(speaker, text, color, onDone, duration = 2800) {
        if (this._dialogBox) this._dialogBox.destroy();

        const box = this.add.container(640, 630).setDepth(60);
        const bg  = this.add.rectangle(0, 0, 900, 90, 0x000000, 0.82)
            .setStrokeStyle(1, 0x888888);
        const txt = this.add.text(0, speaker ? 10 : 0, text, {
            fontSize: '22px', fill: color, align: 'center', wordWrap: { width: 860 },
        }).setOrigin(0.5);

        const children = [bg, txt];
        if (speaker) {
            const sp = this.add.text(0, -30, speaker, {
                fontSize: '16px', fill: COLORS.GOLD, fontStyle: 'italic',
            }).setOrigin(0.5);
            children.push(sp);
        }

        box.add(children);
        this._dialogBox = box;

        // Click to skip or auto-advance
        const advance = () => {
            if (this._dialogBox) { this._dialogBox.destroy(); this._dialogBox = null; }
            onDone();
        };
        this.input.once('pointerdown', advance);
        
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  WAVE SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    _spawnWave(wave) {
        this._wave = wave;
        this._aliveCount = 0;

        const configs = this._getWaveConfig(wave);
        this.waveTxt.setText(`Wave ${wave} / 3`);

        // Announce wave
        const ann = this.add.text(640, 360, `WAVE ${wave}`, {
            fontSize: '56px', fill: COLORS.RED,
            stroke: '#000000', strokeThickness: 6,
        }).setOrigin(0.5).setDepth(55).setAlpha(0);

        this.tweens.add({
            targets: ann, alpha: 1, duration: 300, yoyo: true, hold: 600,
            onComplete: () => ann.destroy(),
        });

        this.time.delayedCall(900, () => {
            configs.forEach((cfg, idx) => {
                this.time.delayedCall(idx * 400, () => this._spawnEnemy(cfg));
            });
        });
    }

    _getWaveConfig(wave) {
        // Wave 1: 2 goblins
        // Wave 2: 2 goblins + 1 bandit
        // Wave 3: 2 bandits + 1 big bandit (boss-lite)
        switch (wave) {
            case 1: return [
                { ...ENEMIES.GOBLIN,  spawnX: 900 },
                { ...ENEMIES.GOBLIN,  spawnX: 1050 },
            ];
            case 2: return [
                { ...ENEMIES.GOBLIN,  spawnX: 950 },
                { ...ENEMIES.GOBLIN,  spawnX: 1100 },
                { ...ENEMIES.BANDIT,  spawnX: 1150 },
            ];
            case 3: return [
                { ...ENEMIES.BANDIT,  spawnX: 900  },
                { ...ENEMIES.BANDIT,  spawnX: 1050 },
                Object.assign({ spawnX: 1200, health: 80, damage: 14 }, ENEMIES.BANDIT), // mini-boss
            ];
            default: return [];
        }
    }

    _spawnEnemy(cfg) {
        const e = new Enemy(this, cfg.spawnX, GAME.GROUND_Y - 60, cfg);
        this.enemyGroup.add(e);
        this._enemies.push(e);
        this._aliveCount++;

        e.on('died', (dead) => {
            const idx = this._enemies.indexOf(dead);
            if (idx !== -1) this._enemies.splice(idx, 1);
            this._aliveCount--;
            this._updateScore();
            if (this._aliveCount <= 0) this._onWaveCleared();
        });


        // Player body vs enemy
        this.physics.add.overlap(this.player, e, () => {
            if (this.player.isAlive && e.isAlive && !this.player.isDashing) {
                this.player.takeDamage(1); // constant passive damage for touching
            }
        });
    }

    _onWaveCleared() {
        if (this._phase !== 'fight') return;

        const next = this.add.text(640, 360, 'WAVE CLEARED!', {
            fontSize: '44px', fill: COLORS.GREEN,
            stroke: '#000000', strokeThickness: 5,
        }).setOrigin(0.5).setDepth(55);
        this.time.delayedCall(1200, () => next.destroy());

        if (this._wave < 3) {
            this.time.delayedCall(1800, () => this._spawnWave(this._wave + 1));
        } else {
            // All waves done → trigger post-fight sequence
            this.time.delayedCall(1600, () => this._onFightComplete());
        }
    }

    // ✅ Add this once
_damageEnemiesInRadius(x, y, radius, multiplier = 1) {
    for (const e of this._enemies) {
        if (!e.isAlive) continue;
        if (Phaser.Math.Distance.Between(x, y, e.x, e.y) < radius) {
            e.takeDamage(this.player.attackDmg * multiplier);
        }
    }
}

// Then simplify both callers:
_checkMeleeHit(hx, hy)      { this._damageEnemiesInRadius(hx, hy, 90); }
_triggerUltimate(x, y)      { this._damageEnemiesInRadius(x, y, 300, 2.5); }

    // ─────────────────────────────────────────────────────────────────────────
    //  POST-FIGHT SEQUENCE
    // ─────────────────────────────────────────────────────────────────────────
    _onFightComplete() {
        this._phase = 'cutscene';
        this.waveTxt.setText('');

        // Crystal shard appears
        this.shardSprite.setAlpha(1);
        this.tweens.add({
            targets: this.shardSprite,
            y: this.shardSprite.y - 10,
            duration: 800,
            yoyo: true,
            repeat: -1,
        });

        // Screen tint back to normal
        this.cameras.main.resetFX();

        this.time.delayedCall(400, () => {
            // Wise Man dialogue
            this._showNarrativeLines(WISE_MAN_LINES, () => {
                this._collectShard();
            });
        });
    }

    _collectShard() {
        // Player walks to shard position
        this.tweens.add({
            targets: this.shardSprite,
            scaleX: 0, scaleY: 0,
            alpha: 0,
            duration: 500,
        });

        const flash = this.add.rectangle(640, 360, 1280, 720, 0xffffff, 0)
            .setDepth(70);
        this.tweens.add({
            targets: flash, alpha: 0.6, duration: 400, yoyo: true,
        });

        const collected = this.add.text(640, 280, '✦  SHARD COLLECTED  ✦', {
            fontSize: '36px', fill: COLORS.GOLD,
            stroke: '#000000', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(70);

        this.shards++;
        this.shardTxt.setText(`Shards: ${this.shards}`);

        this.time.delayedCall(2200, () => {
            collected.destroy();
            this._phase = 'complete';
            this._showDialog(null,
                `Shard ${this.shards}/5 recovered. Journey to the Forest of Whispers!`,
                COLORS.CYAN,
                () => this._goToNextChapter()
            );
        });
    }

    _goToNextChapter() {
        this.cameras.main.fadeOut(700, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(SCENES.FOREST, {
                playerType: this.playerType,
                shards: this.shards,
                savedVillagers: this.savedVillagers,
            });
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  SCORE
    // ─────────────────────────────────────────────────────────────────────────
    _updateScore() {
        this.scoreTxt.setText(`Score: ${this.player.score}`);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  UPDATE LOOP
    // ─────────────────────────────────────────────────────────────────────────
    update() {
        if (this.player && this.player.isAlive) {
            this.player.update();
        }
        this._enemies.forEach(e => e.update());
    }
}
