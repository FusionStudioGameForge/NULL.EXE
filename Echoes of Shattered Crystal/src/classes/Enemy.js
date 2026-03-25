// src/classes/Enemy.js
// =============================================
// Reusable Enemy class — AI movement, health, death
// Extended by specific enemy types
// =============================================

import { COLORS } from '../utils/constants.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, config) {
        super(scene, x, y, config.key);

        this.scene    = scene;
        this.cfg      = config;
        this.maxHp    = config.health;
        this.hp       = config.health;
        this.speed    = config.speed;
        this.damage   = config.damage;
        this.scoreVal = config.score;
        this.isAlive  = true;


        this.load.image(x, y, 'goblin','assets/images/characters/goblin.png',{ frameWidth: 64, frameHeight: 64 });
        this.load.sprite(x, y, 'goblin','assets/images/characters/goblin.png',{ frameWidth: 64, frameHeight: 64 });

        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setDepth(8);

        // Health bar above enemy
        this._buildHPBar();
        this._createAnimations();

        // AI: start chasing after short delay
        this.scene.time.delayedCall(Phaser.Math.Between(300, 800), () => {
            this._startAI();
        });
    }

    _createAnimations() {
        const k = this.cfg.key;
        const safe = (key, cfg) => {
            if (!this.scene.anims.exists(key)) this.scene.anims.create({ key, ...cfg });
        };

        safe(`${k}_walk`, {
            frames: this.scene.anims.generateFrameNumbers(k, { start: 0, end: 5 }),
            frameRate: 10, repeat: -1,
        });
        safe(`${k}_attack`, {
            frames: this.scene.anims.generateFrameNumbers(k, { start: 6, end: 9 }),
            frameRate: 12, repeat: 0,
        });
        safe(`${k}_hurt`, {
            frames: this.scene.anims.generateFrameNumbers(k, { start: 10, end: 11 }),
            frameRate: 10, repeat: 0,
        });
        safe(`${k}_die`, {
            frames: this.scene.anims.generateFrameNumbers(k, { start: 12, end: 16 }),
            frameRate: 8, repeat: 0,
        });
    }

    _buildHPBar() {
        const w = 50;
        this.hpBarBg   = this.scene.add.rectangle(this.x, this.y - 50, w, 6, 0x440000).setDepth(20);
        this.hpBarFill = this.scene.add.rectangle(this.x, this.y - 50, w, 6, 0xff2222).setDepth(21);
    }

    _updateHPBar() {
        const pct = Math.max(0, this.hp / this.maxHp);
        this.hpBarBg.setPosition(this.x, this.y - 50);
        this.hpBarFill.setPosition(this.x, this.y - 50);
        this.hpBarFill.setScale(pct, 1);
        this.hpBarFill.setX(this.x - (50 * (1 - pct)) / 2);
        this.hpBarFill.setFillStyle(pct > 0.5 ? 0x22cc22 : pct > 0.25 ? 0xffaa00 : 0xff2222);
    }

    _startAI() {
        // AI loop: find player and chase
        this.aiTimer = this.scene.time.addEvent({
            delay: 200,
            loop: true,
            callback: this._thinkAI,
            callbackScope: this,
        });
    }

    _thinkAI() {
        if (!this.isAlive || !this.scene.player) return;
        const player = this.scene.player;
        if (!player.isAlive) {
            this.setVelocityX(0);
            return;
        }

        const dx = player.x - this.x;
        const dist = Math.abs(dx);

        if (dist < 60) {
            // In melee range — stop and attack
            this.setVelocityX(0);
            this._attackPlayer();
        } else {
            // Chase
            const dir = dx > 0 ? 1 : -1;
            this.setVelocityX(dir * this.speed);
            this.setFlipX(dir < 0);
            this.play(`${this.cfg.key}_walk`, true);
        }
    }

    _attackPlayer() {
        if (this.isAttacking) return;
        this.isAttacking = true;
        this.play(`${this.cfg.key}_attack`, true);

        this.scene.time.delayedCall(300, () => {
            if (this.scene.player && this.scene.player.isAlive) {
                const dist = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
                if (dist < 80) {
                    this.scene.player.takeDamage(this.damage);
                }
            }
            this.isAttacking = false;
        });
    }

    takeDamage(amount) {
        if (!this.isAlive) return;
        this.hp = Math.max(0, this.hp - amount);
        this._updateHPBar();

        this.setTint(0xff8888);
        this.scene.time.delayedCall(150, () => { if (this.isAlive) this.clearTint(); });

        // Knockback
        const knockDir = (this.scene.player && this.scene.player.x < this.x) ? 1 : -1;
        this.setVelocityX(knockDir * 180);

        // Floating damage number
        this._showDamageText(amount);

        if (this.hp <= 0) this._die();
    }

    _showDamageText(amount) {
        const txt = this.scene.add.text(this.x, this.y - 60, `-${amount}`, {
            fontSize: '20px', fill: '#ff4444',
            stroke: '#000000', strokeThickness: 3,
        }).setDepth(30);
        this.scene.tweens.add({
            targets: txt,
            y: txt.y - 40,
            alpha: 0,
            duration: 700,
            onComplete: () => txt.destroy(),
        });
    }

    _die() {
        this.isAlive = false;
        if (this.aiTimer) this.aiTimer.destroy();
        this.play(`${this.cfg.key}_die`, true);
        this.setVelocityX(0);
        this.body.enable = false;

        // Clean up HP bar
        this.scene.time.delayedCall(50, () => {
            this.hpBarBg.destroy();
            this.hpBarFill.destroy();
        });

        // Score
        if (this.scene.player) this.scene.player.addScore(this.scoreVal);

        this.scene.time.delayedCall(800, () => {
            this.emit('died', this);
            this.destroy();
        });
    }

    update() {
        if (!this.isAlive) return;
        this._updateHPBar();
    }
}
