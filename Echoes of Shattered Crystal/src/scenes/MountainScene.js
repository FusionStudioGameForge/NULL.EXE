// src/scenes/MountainScene.js
// =============================================
// CHAPTER 5 – The Final Mountain
// Boss fight: Dragon (3-phase)
// Twist ending: Restore Peace vs Keep Power
// =============================================

import { SCENES, ENEMIES, COLORS, GAME } from '../utils/constants.js';
import Player from '../classes/Player.js';
import Enemy  from '../classes/Enemy.js';

const INTRO_LINES = [
    { text: 'The Final Mountain… cursed with ancient darkness.',       color: COLORS.WHITE  },
    { text: 'Five shards in hand. One battle remains.',                color: COLORS.GOLD   },
    { text: 'The dragon has awaited this day for a thousand years.',   color: COLORS.RED    },
    { text: 'Face your destiny.',                                      color: COLORS.CYAN   },
];

const DRAGON_PHASES = [
    { hp: 400, text: 'THE DRAGON AWAKES',   color: COLORS.RED    },
    { hp: 260, text: 'DRAGON ENRAGED!',      color: COLORS.ORANGE },
    { hp: 130, text: '⚠ FINAL FORM ⚠',      color: COLORS.PURPLE },
];

export default class MountainScene extends Phaser.Scene {
    constructor() {
        super(SCENES.MOUNTAIN);
    }

    init(data) {
        this.playerType     = data.playerType    || 'orion';
        this.shards         = data.shards        || 4;
        this.savedVillagers = data.savedVillagers || false;
    }

    create() {
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this._phase       = 'intro';
        this._dragonPhase = 0;
        this._dragon      = null;

        // ── World ────────────────────────────────────────────────
        this.add.image(640, 360, 'mountain_bg').setDisplaySize(1280, 720);
        this.add.rectangle(640, 360, 1280, 720, 0x050015, 0.45);

        // Fog/mist effect
        this._buildFogParticles();

        // Ground
        this.ground = this.physics.add.staticGroup();
        const g = this.ground.create(640, GAME.GROUND_Y + 20, null);
        g.setVisible(false).setSize(1280, 40).refreshBody();

        // ── HUD ──────────────────────────────────────────────────
        this._buildHUD();

        // ── Shard (final) ─────────────────────────────────────────
        this.shardSprite = this.add.image(640, GAME.GROUND_Y - 30, 'crystal')
            .setScale(2).setAlpha(0).setDepth(15);

        // ── Player ───────────────────────────────────────────────
        this.player = new Player(this, 150, GAME.GROUND_Y - 60, this.playerType);
        // Unlock all remaining abilities
        ['shield','dash','ultimate'].forEach(a => this.player.unlockAbility(a));
        this.physics.add.collider(this.player, this.ground);
        this.player.on('meleeHit', (hx, hy) => this._checkMeleeHit(hx, hy));
        this.player.on('ultimate', (x, y)   => this._triggerUltimate(x, y));

        this.time.delayedCall(600, () => this._runIntro());
    }

    _buildFogParticles() {
        const g = this.add.graphics().setDepth(2).setAlpha(0.15);
        g.fillStyle(0x8899cc);
        for (let i = 0; i < 8; i++) {
            g.fillEllipse(
                Phaser.Math.Between(100, 1180),
                Phaser.Math.Between(400, 600),
                Phaser.Math.Between(80, 200),
                Phaser.Math.Between(20, 50)
            );
        }
    }

    _buildHUD() {
        this.add.text(640, 20, 'CHAPTER 5 — The Final Mountain', {
            fontSize: '22px', fill: COLORS.RED,
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

        this.phaseTxt = this.add.text(640, 50, '', {
            fontSize: '18px', fill: COLORS.WHITE,
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

        this.shardTxt = this.add.text(1250, 20, `Shards: ${this.shards}/5`, {
            fontSize: '18px', fill: COLORS.CYAN,
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(50);

        // Dragon boss HP bar (hidden until dragon spawns)
        this.dragonHPBg   = this.add.rectangle(640, 690, 600, 20, 0x440000)
            .setScrollFactor(0).setDepth(50).setAlpha(0);
        this.dragonHPFill = this.add.rectangle(640, 690, 600, 20, 0xff2200)
            .setScrollFactor(0).setDepth(51).setAlpha(0);
        this.dragonHPLabel = this.add.text(640, 690, 'DRAGON', {
            fontSize: '13px', fill: '#ffffff',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(52).setAlpha(0);

        // Ability reminder
        this.add.text(640, 680, 'Z:Attack  X:Shield  C:Dash  V:Crystal Blast', {
            fontSize: '13px', fill: '#888888',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50);
    }

    _updateDragonHP() {
        if (!this._dragon) return;
        const pct = Math.max(0, this._dragon.hp / this._dragon.maxHp);
        this.dragonHPFill.setScale(pct, 1);
        this.dragonHPFill.setX(640 - (600 * (1 - pct)) / 2);
        this.dragonHPFill.setFillStyle(pct > 0.5 ? 0xff4400 : pct > 0.25 ? 0xff8800 : 0xffcc00);
    }

    _runIntro() {
        this._showNarrativeLines(INTRO_LINES, () => {
            this._phase = 'fight';
            this._spawnDragon();
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  DRAGON BOSS
    // ─────────────────────────────────────────────────────────────────────────
    _spawnDragon() {
        // Boss title
        const ann = this.add.text(640, 280, '🐉  THE CURSED DRAGON  🐉', {
            fontSize: '44px', fill: COLORS.RED,
            stroke: '#000000', strokeThickness: 6,
        }).setOrigin(0.5).setDepth(55);
        this.cameras.main.shake(400, 0.015);
        this.cameras.main.flash(200, 150, 0, 0);
        this.time.delayedCall(2200, () => ann.destroy());

        this.phaseTxt.setText('Phase 1 — Face the Dragon!');

        this.time.delayedCall(1500, () => {
            const dragonCfg = {
                ...ENEMIES.DRAGON,
                health: this.savedVillagers ? 340 : 400,
                spawnX: 950,
            };
            const d = new Enemy(this, dragonCfg.spawnX, GAME.GROUND_Y - 100, dragonCfg);
            d.setScale(2.5);
            d.setDepth(9);
            this._dragon = d;

            // Show dragon HP bar
            this.dragonHPBg.setAlpha(1);
            this.dragonHPFill.setAlpha(1);
            this.dragonHPLabel.setAlpha(1);

            this.physics.add.collider(d, this.ground);
            this.physics.add.overlap(this.player.projectiles, d,
                (arrow, dragon) => {
                    if (dragon.isAlive) { dragon.takeDamage(this.player.attackDmg); arrow.destroy(); this._updateDragonHP(); this._checkDragonPhase(); }
                }
            );
            this.physics.add.overlap(this.player, d, () => {
                if (this.player.isAlive && d.isAlive && !this.player.isDashing)
                    this.player.takeDamage(2);
            });

            d.on('died', () => this._onDragonDefeated());
        });
    }

    _checkDragonPhase() {
        if (!this._dragon || !this._dragon.isAlive) return;
        const hp = this._dragon.hp;

        if (this._dragonPhase === 0 && hp <= 260) {
            this._dragonPhase = 1;
            this._triggerPhaseTransition(1);
        } else if (this._dragonPhase === 1 && hp <= 130) {
            this._dragonPhase = 2;
            this._triggerPhaseTransition(2);
        }
    }

    _triggerPhaseTransition(phase) {
        const info = DRAGON_PHASES[phase];
        this.cameras.main.shake(500, 0.012);
        this.cameras.main.flash(300, 200, 0, 0);

        const ann = this.add.text(640, 300, info.text, {
            fontSize: '38px', fill: info.color,
            stroke: '#000000', strokeThickness: 5,
        }).setOrigin(0.5).setDepth(55);
        this.time.delayedCall(1600, () => ann.destroy());

        this.phaseTxt.setText(`Phase ${phase + 1} — ${info.text}`);

        // Phase 2: dragon gets speed boost
        if (phase === 1 && this._dragon) this._dragon.speed += 30;
        // Phase 3: dragon gets damage boost
        if (phase === 2 && this._dragon) this._dragon.damage += 10;
    }

    _checkMeleeHit(hx, hy) {
        if (this._dragon && this._dragon.isAlive) {
            const dist = Phaser.Math.Distance.Between(hx, hy, this._dragon.x, this._dragon.y);
            if (dist < 130) {
                this._dragon.takeDamage(this.player.attackDmg);
                this._updateDragonHP();
                this._checkDragonPhase();
            }
        }
    }

    _triggerUltimate(x, y) {
        const ring = this.add.circle(x, y, 10, 0x8844ff, 0.8).setDepth(30);
        this.tweens.add({ targets: ring, radius: 350, alpha: 0, duration: 700, onComplete: () => ring.destroy() });
        if (this._dragon && this._dragon.isAlive) {
            const d = Phaser.Math.Distance.Between(x, y, this._dragon.x, this._dragon.y);
            if (d < 350) {
                this._dragon.takeDamage(this.player.attackDmg * 3);
                this._updateDragonHP();
                this._checkDragonPhase();
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  DRAGON DEFEATED
    // ─────────────────────────────────────────────────────────────────────────
    _onDragonDefeated() {
        this._phase = 'ending';
        this.dragonHPBg.setAlpha(0);
        this.dragonHPFill.setAlpha(0);
        this.dragonHPLabel.setAlpha(0);

        this.cameras.main.shake(800, 0.02);
        this.cameras.main.flash(500, 255, 200, 100);
        this.phaseTxt.setText('');

        this.time.delayedCall(1500, () => {
            // Crystal forms
            this.shardSprite.setAlpha(1);
            this.tweens.add({
                targets: this.shardSprite, angle: 360,
                scaleX: 2.5, scaleY: 2.5,
                duration: 1200, ease: 'Power2',
            });

            this.time.delayedCall(1800, () => {
                this.shards++;
                this.shardTxt.setText(`Shards: ${this.shards}/5`);
                this._showNarrativeLines([
                    { text: 'The fifth shard… the crystal is whole again!', color: COLORS.GOLD   },
                    { speaker: 'Wise Man', text: '"The power of the completed crystal is in your hands now, hunter."' },
                    { speaker: 'Wise Man', text: '"What you choose next will decide the fate of this land."' },
                ], () => this._showEndingChoice());
            });
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  ENDING CHOICE
    // ─────────────────────────────────────────────────────────────────────────
    _showEndingChoice() {
        this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.6).setDepth(58);

        this.add.text(640, 140, 'THE CRYSTAL IS WHOLE', {
            fontSize: '40px', fill: COLORS.GOLD,
            stroke: '#000000', strokeThickness: 5,
        }).setOrigin(0.5).setDepth(60);

        this.add.text(640, 200, 'Make your final choice, hunter.', {
            fontSize: '22px', fill: COLORS.WHITE,
        }).setOrigin(0.5).setDepth(60);

        this._buildEndingCard(
            290, 420,
            '✦  RESTORE PEACE',
            'Sacrifice the crystal\'s power.\nThe curse is lifted. The land is saved.\nYou become a legend.',
            0x0066ff,
            'GOOD',
            () => this._triggerEnding('good')
        );

        this._buildEndingCard(
            990, 420,
            '💀  KEEP THE POWER',
            'Absorb the crystal into yourself.\nYou become the new ruler of the land.\nDark. Absolute. Eternal.',
            0xaa0000,
            'DARK',
            () => this._triggerEnding('dark')
        );
    }

    _buildEndingCard(x, y, title, desc, color, tag, onClick) {
        const card = this.add.container(x, y).setDepth(61);
        const bg   = this.add.rectangle(0, 0, 500, 280, 0x0a0a1a, 0.95).setStrokeStyle(2, color);
        const tagBadge = this.add.rectangle(0, -115, 80, 26, color, 0.9);
        const tagTxt   = this.add.text(0, -115, tag, { fontSize: '13px', fill: '#ffffff' }).setOrigin(0.5);
        const titleTxt = this.add.text(0, -75, title, { fontSize: '24px', fill: `#${color.toString(16).padStart(6,'0')}`, align: 'center' }).setOrigin(0.5);
        const descTxt  = this.add.text(0, 10, desc, { fontSize: '17px', fill: COLORS.WHITE, align: 'center', wordWrap: { width: 460 } }).setOrigin(0.5);
        const btn      = this.add.rectangle(0, 100, 300, 48, color, 0.85).setInteractive({ useHandCursor: true });
        const btnTxt   = this.add.text(0, 100, 'CHOOSE THIS PATH', { fontSize: '18px', fill: '#ffffff' }).setOrigin(0.5);

        btn.on('pointerover', () => btn.setAlpha(1));
        btn.on('pointerout',  () => btn.setAlpha(0.85));
        btn.on('pointerdown', onClick);

        card.add([bg, tagBadge, tagTxt, titleTxt, descTxt, btn, btnTxt]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  ENDINGS
    // ─────────────────────────────────────────────────────────────────────────
    _triggerEnding(type) {
        this.cameras.main.fadeOut(800, type === 'good' ? 255 : 0, type === 'good' ? 255 : 0, type === 'good' ? 255 : 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(SCENES.VICTORY, {
                playerType: this.playerType,
                endingType: type,
                savedVillagers: this.savedVillagers,
                score: this.player ? this.player.score : 0,
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
            this._showDialog(line.speaker || null, line.text, line.color, showNext, 2600);
        };
        showNext();
    }

    update() {
        if (this.player && this.player.isAlive) this.player.update();
        if (this._dragon && this._dragon.active) this._dragon.update();
    }
}
