// src/scenes/GraveyardScene.js
// =============================================
// CHAPTER 3 – The Dead Man's Elm
// Enemies: Skeletons
// Moral choice: Save villagers vs ignore them
// Unlocks: Shield ability
// =============================================

import { SCENES, ENEMIES, COLORS, GAME } from '../utils/constants.js';
import Player from '../classes/Player.js';
import Enemy  from '../classes/Enemy.js';

const INTRO_LINES = [
    { text: 'The Dead Man\'s Elm… scattered bones litter the earth.', color: COLORS.WHITE  },
    { text: 'The dead walk here, cursed and restless.',               color: COLORS.PURPLE },
    { text: 'And somewhere ahead… captured villagers cry for help.',  color: COLORS.GOLD   },
];

export default class GraveyardScene extends Phaser.Scene {
    constructor() {
        super(SCENES.GRAVEYARD);
    }

    init(data) {
        this.playerType     = data.playerType    || 'orion';
        this.shards         = data.shards        || 2;
        this.savedVillagers = data.savedVillagers || false;
    }

    create() {
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this._phase   = 'intro';
        this._enemies = [];
        this._aliveCount = 0;
        this._choiceMade = false;

        // ── World ────────────────────────────────────────────────
        this.add.image(640, 360, 'graveyard_bg').setDisplaySize(1280, 720);
        this.add.rectangle(640, 360, 1280, 720, 0x110022, 0.4);

        // Ground
        this.ground = this.physics.add.staticGroup();
        const g = this.ground.create(640, GAME.GROUND_Y + 20, null);
        g.setVisible(false).setSize(1280, 40).refreshBody();

        // ── Scattered bone decoration ────────────────────────────
        this._drawBones();

        // ── Captured villager cages (visual) ─────────────────────
        this._buildVillagerCages();

        // ── HUD ──────────────────────────────────────────────────
        this._buildHUD();

        // ── Shard ────────────────────────────────────────────────
        this.shardSprite = this.add.image(640, GAME.GROUND_Y - 30, 'shard')
            .setScale(1.5).setAlpha(0).setDepth(15);

        // ── Player ───────────────────────────────────────────────
        this.player = new Player(this, 150, GAME.GROUND_Y - 60, this.playerType);
        this.physics.add.collider(this.player, this.ground);
        this.player.on('meleeHit', (hx, hy) => this._checkMeleeHit(hx, hy));
        this.player.on('ultimate', (x, y)   => this._triggerUltimate(x, y));

        // ── Enemies ──────────────────────────────────────────────
        this.enemyGroup = this.physics.add.group();
        this.physics.add.collider(this.enemyGroup, this.ground);
        this.physics.add.overlap(this.player.projectiles, this.enemyGroup,
            (arrow, enemy) => {
                if (enemy.isAlive) { enemy.takeDamage(this.player.attackDmg); arrow.destroy(); }
            }
        );

        this.time.delayedCall(600, () => this._runIntro());
    }

    _drawBones() {
        const g = this.add.graphics().setDepth(2);
        g.fillStyle(0xddddbb, 0.6);
        // Scattered bone-like marks
        [[200, 570],[350, 590],[500, 575],[750, 580],[900, 565],[1050, 590],[1150, 575]].forEach(([x,y]) => {
            g.fillEllipse(x, y, 30, 10);
            g.fillEllipse(x + 20, y + 5, 20, 8);
        });
    }

    _buildVillagerCages() {
        const g = this.add.graphics().setDepth(3);
        g.lineStyle(2, 0x886644, 0.9);
        // Two cages
        [[180, 430], [320, 440]].forEach(([cx, cy]) => {
            g.strokeRect(cx - 25, cy - 40, 50, 60);
            for (let i = 0; i <= 4; i++) g.lineBetween(cx - 25 + i * 12.5, cy - 40, cx - 25 + i * 12.5, cy + 20);
        });
        this.add.text(250, 380, 'Villagers!', {
            fontSize: '16px', fill: COLORS.GOLD,
        }).setOrigin(0.5).setDepth(4);
    }

    _buildHUD() {
        this.add.text(640, 20, "CHAPTER 3 — The Dead Man's Elm", {
            fontSize: '22px', fill: COLORS.PURPLE,
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

        this.waveTxt  = this.add.text(640, 50, '', {
            fontSize: '18px', fill: COLORS.WHITE,
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

        this.shardTxt = this.add.text(1250, 20, `Shards: ${this.shards}`, {
            fontSize: '18px', fill: COLORS.CYAN,
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(50);
    }

    _runIntro() {
        this._showNarrativeLines(INTRO_LINES, () => {
            this._phase = 'fight';
            this._spawnSkeletonWave();
        });
    }

    _spawnSkeletonWave() {
        this.waveTxt.setText('The dead rise!');
        const configs = [
            { ...ENEMIES.SKELETON, spawnX: 950  },
            { ...ENEMIES.SKELETON, spawnX: 1050 },
            { ...ENEMIES.SKELETON, spawnX: 1180 },
            { ...ENEMIES.SKELETON, spawnX: 1100, health: 80, damage: 15, speed: 80 }, // skeleton king
        ];
        this._aliveCount = configs.length;
        configs.forEach((cfg, i) => {
            this.time.delayedCall(i * 500, () => this._spawnEnemy(cfg));
        });
    }

    _spawnEnemy(cfg) {
        const e = new Enemy(this, cfg.spawnX, GAME.GROUND_Y - 60, cfg);
        this.enemyGroup.add(e);
        this._enemies.push(e);

        e.on('died', (dead) => {
            this._enemies = this._enemies.filter(x => x !== dead);
            this._aliveCount = Math.max(0, this._aliveCount - 1);
            if (this._aliveCount === 0 && !this._choiceMade) this._showMoralChoice();
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

    // ─────────────────────────────────────────────────────────────────────────
    //  MORAL CHOICE
    // ─────────────────────────────────────────────────────────────────────────
    _showMoralChoice() {
        this._choiceMade  = true;
        this._phase       = 'choice';
        this.waveTxt.setText('');

        // Darken screen
        this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.5).setDepth(58);

        this.add.text(640, 180, 'THE VILLAGERS CRY OUT…', {
            fontSize: '34px', fill: COLORS.GOLD,
            stroke: '#000000', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(60);

        this.add.text(640, 240, 'What will you do?', {
            fontSize: '22px', fill: COLORS.WHITE,
        }).setOrigin(0.5).setDepth(60);

        // Save button
        const saveCard = this._buildChoiceCard(
            330, 400,
            '🧑‍🤝‍🧑  SAVE THE VILLAGERS',
            'They will join your cause.\nGain loyal allies in later chapters.',
            0x00aa44,
            () => this._makeChoice(true)
        );

        // Ignore button
        const ignoreCard = this._buildChoiceCard(
            950, 400,
            '💀  IGNORE THEM',
            'Absorb the shard\'s dark power.\nGain 50% bonus damage.',
            0xaa0000,
            () => this._makeChoice(false)
        );
    }

    _buildChoiceCard(x, y, title, desc, color, onClick) {
        const card = this.add.container(x, y).setDepth(61);
        const bg   = this.add.rectangle(0, 0, 480, 220, 0x111111, 0.9)
            .setStrokeStyle(2, color, 0.9);
        const titleTxt = this.add.text(0, -70, title, {
            fontSize: '22px', fill: `#${color.toString(16).padStart(6,'0')}`,
            align: 'center',
        }).setOrigin(0.5);
        const descTxt = this.add.text(0, 10, desc, {
            fontSize: '17px', fill: COLORS.WHITE,
            align: 'center', wordWrap: { width: 440 },
        }).setOrigin(0.5);
        const btn = this.add.rectangle(0, 80, 280, 44, color, 0.85)
            .setInteractive({ useHandCursor: true });
        const btnTxt = this.add.text(0, 80, 'CHOOSE', {
            fontSize: '18px', fill: '#000000',
        }).setOrigin(0.5);

        btn.on('pointerover', () => btn.setAlpha(1));
        btn.on('pointerout',  () => btn.setAlpha(0.85));
        btn.on('pointerdown', onClick);

        card.add([bg, titleTxt, descTxt, btn, btnTxt]);
        return card;
    }

    _makeChoice(saveVillagers) {
        this.savedVillagers = saveVillagers;

        // Clear choice UI by fading scene
        this.cameras.main.flash(400, 255, 255, 255);

        const resultText = saveVillagers
            ? 'You free the villagers!\nThey vow to fight alongside you.'
            : 'You ignore their cries…\nThe dark shard power surges within you!';

        if (!saveVillagers) {
            // Bonus damage
            this.player.attackDmg = Math.floor(this.player.attackDmg * 1.5);
        }

        this.time.delayedCall(400, () => {
            this._showNarrativeLines(
                [{ text: resultText, color: saveVillagers ? COLORS.GREEN : COLORS.PURPLE }],
                () => this._onFightComplete()
            );
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  POST-FIGHT
    // ─────────────────────────────────────────────────────────────────────────
    _onFightComplete() {
        this._phase = 'cutscene';

        // Unlock shield
        this.player.unlockAbility('shield');

        const banner = this.add.text(640, 250, '✦  SHIELD ABILITY UNLOCKED  ✦', {
            fontSize: '32px', fill: COLORS.CYAN,
            stroke: '#000000', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(60);
        this.add.text(640, 295, 'Hold X to block incoming attacks', {
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

        const msg = this.add.text(640, 280, '✦  SHARD 3 COLLECTED  ✦', {
            fontSize: '36px', fill: COLORS.GOLD,
            stroke: '#000000', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(70);
        this.time.delayedCall(2000, () => {
            msg.destroy();
            this._showDialog(null,
                'The Volcano of Flames awaits. Steel yourself for the heat.',
                COLORS.ORANGE,
                () => this._goToNextChapter()
            );
        });
    }

    _goToNextChapter() {
        this.cameras.main.fadeOut(700, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(SCENES.VOLCANO, {
                playerType: this.playerType,
                shards: this.shards,
                savedVillagers: this.savedVillagers,
            });
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

    _showDialog(speaker, text, color, onDone, duration = 2800) {
        if (this._dialogBox) this._dialogBox.destroy();
        const box = this.add.container(640, 630).setDepth(60);
        const bg  = this.add.rectangle(0, 0, 900, 90, 0x000000, 0.82).setStrokeStyle(1, 0x888888);
        const txt = this.add.text(0, speaker ? 10 : 0, text, {
            fontSize: '22px', fill: color || COLORS.WHITE,
            align: 'center', wordWrap: { width: 860 },
        }).setOrigin(0.5);
        const children = [bg, txt];
        if (speaker) children.push(this.add.text(0, -30, speaker, { fontSize: '16px', fill: COLORS.GOLD, fontStyle: 'italic' }).setOrigin(0.5));
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
