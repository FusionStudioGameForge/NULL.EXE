// src/classes/Player.js
// =============================================
// Reusable Player class for Aria and Orion
// Handles movement, jumping, attacking, abilities, health UI
// =============================================

import { PLAYER, COLORS, GAME } from '../utils/constants.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, playerType) {
        const cfg = playerType === 'aria' ? PLAYER.ARIA : PLAYER.ORION;
        super(scene, x, y, cfg.key);

        this.scene      = scene;
        this.playerType = playerType;
        this.cfg        = cfg;

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setBounce(0.05);
        this.setDragX(900);
        this.setDepth(10);

        // ── Stats ─────────────────────────────────────
        this.maxHealth   = cfg.health;
        this.health      = cfg.health;
        this.speed       = cfg.speed;
        this.jumpVelocity = cfg.jumpVelocity;
        this.attackDmg   = cfg.attackDamage;

        // ── Abilities ─────────────────────────────────
        this.hasSpeedAttack = false;  // Ch2
        this.hasRapidShot   = false;  // Ch2
        this.hasShield      = false;  // Ch3
        this.hasDash        = false;  // Ch4
        this.hasUltimate    = false;  // Ch5

        // ── State flags ───────────────────────────────
        this.isAttacking  = false;
        this.isShielding  = false;
        this.isDashing    = false;
        this.canDash      = true;
        this.canUltimate  = true;
        this.isAlive      = true;
        this.score        = 0;

        // ── Cooldown timers ───────────────────────────
        this.dashCooldown     = 1500;
        this.ultimateCooldown = 8000;

        // ── Projectile group (for Aria's arrows) ──────
        this.projectiles = scene.physics.add.group();

        this._createAnimations();
        this._setupInput();
        this._buildHealthBar();
        this._buildAbilityHUD();
    }

    // ─────────────────────────────────────────────────
    //  ANIMATIONS
    // ─────────────────────────────────────────────────
    _createAnimations() {
        const k = this.playerType;
        const safe = (key, cfg) => {
            if (!this.scene.anims.exists(key)) this.scene.anims.create({ key, ...cfg });
        };

        safe(`${k}_idle`, {
            frames: this.scene.anims.generateFrameNumbers(k, { start: 0, end: 3 }),
            frameRate: 8, repeat: -1,
        });
        safe(`${k}_walk`, {
            frames: this.scene.anims.generateFrameNumbers(k, { start: 4, end: 19 }),
            frameRate: 12, repeat: -1,
        });
        safe(`${k}_jump`, {
            frames: this.scene.anims.generateFrameNumbers(k, { start: 10, end: 12 }),
            frameRate: 10, repeat: 0,
        });
        safe(`${k}_attack`, {
            frames: this.scene.anims.generateFrameNumbers(k, { start: 13, end: 17 }),
            frameRate: 18, repeat: 0,
        });
        safe(`${k}_hurt`, {
            frames: this.scene.anims.generateFrameNumbers(k, { start: 18, end: 19 }),
            frameRate: 10, repeat: 0,
        });
        safe(`${k}_die`, {
            frames: this.scene.anims.generateFrameNumbers(k, { start: 20, end: 24 }),
            frameRate: 8, repeat: 0,
        });
        safe(`${k}_shield`, {
            frames: this.scene.anims.generateFrameNumbers(k, { start: 25, end: 27 }),
            frameRate: 8, repeat: -1,
        });
    }

    // ─────────────────────────────────────────────────
    //  INPUT
    // ─────────────────────────────────────────────────
    _setupInput() {
        this.cursors   = this.scene.input.keyboard.createCursorKeys();
        this.attackKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.shieldKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.dashKey   = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        

        this.attackKey.on('down', () => this.attack());
        
    }

    // ─────────────────────────────────────────────────
    //  HUD – Health bar
    // ─────────────────────────────────────────────────
    _buildHealthBar() {
        const x = 30, y = 30;
        this.hpBg   = this.scene.add.rectangle(x + 100, y + 10, 200, 18, 0x440000).setScrollFactor(0).setDepth(50);
        this.hpFill = this.scene.add.rectangle(x + 100, y + 10, 200, 18, 0xff2222).setScrollFactor(0).setDepth(51);
        this.hpText = this.scene.add.text(x + 100, y + 10, `${this.health}/${this.maxHealth}`, {
            fontSize: '13px', fill: '#ffffff',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(52);

        const label = this.scene.add.text(x, y, this.cfg.name, {
            fontSize: '18px', fill: this.playerType === 'aria' ? COLORS.CYAN : COLORS.ORANGE,
        }).setScrollFactor(0).setDepth(52);
    }

    _updateHealthBar() {
        const pct  = Math.max(0, this.health / this.maxHealth);
        this.hpFill.setScale(pct, 1);
        this.hpFill.setX(30 + 100 - (200 * (1 - pct)) / 2);
        this.hpFill.setFillStyle(pct > 0.5 ? 0x22dd22 : pct > 0.25 ? 0xffaa00 : 0xff2222);
        this.hpText.setText(`${this.health}/${this.maxHealth}`);
    }

    // ─────────────────────────────────────────────────
    //  HUD – Ability icons
    // ─────────────────────────────────────────────────
    _buildAbilityHUD() {
        const y = 680;
        const abilities = [
            { label: 'Z\nATK',  x: 40  },
            { label: 'X\nSHLD', x: 100 },
            { label: 'C\nDASH', x: 160 },
            { label: 'V\nULT',  x: 220 },
        ];
        abilities.forEach(a => {
            this.scene.add.rectangle(a.x, y, 48, 48, 0x222222, 0.8)
                .setScrollFactor(0).setDepth(50).setStrokeStyle(1, 0x888888);
            this.scene.add.text(a.x, y, a.label, {
                fontSize: '11px', fill: '#cccccc', align: 'center',
            }).setOrigin(0.5).setScrollFactor(0).setDepth(51);
        });
    }

    // ─────────────────────────────────────────────────
    //  UPDATE (called every frame)
    // ─────────────────────────────────────────────────
    update() {
        if (!this.isAlive || this.isDashing) return;

        // Shield hold
        if (this.hasShield && this.shieldKey.isDown) {
            this._holdShield();
            return;   // can't move while shielding
        } else {
            this.isShielding = false;
        }

        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
            if (this.body.touching.down) this.play(`${this.playerType}_walk`, true);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
            if (this.body.touching.down) this.play(`${this.playerType}_walk`, true);
        } else {
            this.setVelocityX(0);
            if (this.body.touching.down && !this.isAttacking)
                this.play(`${this.playerType}_idle`, true);
        }

        // Jump
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.body.touching.down) {
            this.setVelocityY(this.jumpVelocity);
            this.play(`${this.playerType}_jump`, true);
        }

        // Dash
        if (this.hasDash && Phaser.Input.Keyboard.JustDown(this.dashKey) && this.canDash) {
            this._executeDash();
        }
    }

    // ─────────────────────────────────────────────────
    //  ATTACK
    // ─────────────────────────────────────────────────
    attack() {
        if (!this.isAlive || this.isAttacking) return;
        this.isAttacking = true;
        this.play(`${this.playerType}_attack`, true);

        if (this.playerType === 'aria') {
            this._shootArrow();
            if (this.hasRapidShot) {
                this.scene.time.delayedCall(200, () => this._shootArrow());
                this.scene.time.delayedCall(400, () => this._shootArrow());
            }
        } else {
            // Sword: emit melee hitbox event for VillageScene to pick up
            this.scene.time.delayedCall(150, () => {
                this.emit('meleeHit', this.x + (this.flipX ? -70 : 70), this.y);
            });
            if (this.hasSpeedAttack) {
                this.scene.time.delayedCall(350, () => {
                    if (this.isAlive) this.emit('meleeHit', this.x + (this.flipX ? -70 : 70), this.y);
                });
            }
        }

        this.scene.time.delayedCall(450, () => { this.isAttacking = false; });
    }

    _shootArrow() {
        const dir = this.flipX ? -1 : 1;
        const arrow = this.projectiles.create(
            this.x + dir * 40, this.y - 20, 'arrow'
        );
        if (!arrow) return;
        arrow.setVelocityX(dir * 650);
        arrow.setFlipX(this.flipX);
        arrow.setScale(0.8);
        arrow.setDepth(9);
        arrow.damage = this.attackDmg;
        this.scene.time.delayedCall(2200, () => { if (arrow.active) arrow.destroy(); });
    }

    // ─────────────────────────────────────────────────
    //  SHIELD
    // ─────────────────────────────────────────────────
    _holdShield() {
        if (!this.isShielding) {
            this.isShielding = true;
            this.play(`${this.playerType}_shield`, true);
            this.setTint(0x4488ff);
        }
        this.setVelocityX(0);
    }

    // ─────────────────────────────────────────────────
    //  DASH
    // ─────────────────────────────────────────────────
    _executeDash() {
        this.canDash  = false;
        this.isDashing = true;
        const dir = this.flipX ? -1 : 1;
        this.setVelocityX(dir * 900);
        this.setTint(0x00ffff);
        this.setAlpha(0.7);

        // Afterimage trail
        for (let i = 0; i < 4; i++) {
            this.scene.time.delayedCall(i * 60, () => {
                const ghost = this.scene.add.sprite(this.x, this.y, this.playerType)
                    .setTint(0x00ccff).setAlpha(0.4 - i * 0.08).setScale(this.scaleX);
                this.scene.time.delayedCall(200, () => ghost.destroy());
            });
        }

        this.scene.time.delayedCall(280, () => {
            this.setVelocityX(0);
            this.clearTint();
            this.setAlpha(1);
            this.isDashing = false;
        });
        this.scene.time.delayedCall(this.dashCooldown, () => { this.canDash = true; });
    }

    // ─────────────────────────────────────────────────
    //  ULTIMATE
    // ─────────────────────────────────────────────────
    useUltimate() {
        if (!this.hasUltimate || !this.canUltimate || !this.isAlive) return;
        this.canUltimate = true;

        // Screen flash
        this.scene.cameras.main.flash(300, 200, 100, 255);

        // Shockwave — emit for scene to handle
        this.emit('ultimate', this.x, this.y);

        this.scene.time.delayedCall(this.ultimateCooldown, () => { this.canUltimate = true; });
    }

    // ─────────────────────────────────────────────────
    //  TAKE DAMAGE
    // ─────────────────────────────────────────────────
    takeDamage(amount) {
        if (!this.isAlive) return;
        if (this.isShielding) {
            // Shield absorbs 70%
            amount = Math.floor(amount * 0.3);
            this.scene.cameras.main.shake(80, 0.003);
        }

        this.health = Math.max(0, this.health - amount);
        this._updateHealthBar();

        this.setTint(0xff4444);
        this.scene.cameras.main.shake(120, 0.006);
        this.scene.time.delayedCall(220, () => { if (this.isAlive) this.clearTint(); });

        // Knockback
        const knockDir = this.flipX ? 1 : -1;
        this.setVelocityX(knockDir * 200);

        if (this.health <= 0) this._die();
    }

    _die() {
        this.isAlive = false;
        this.play(`${this.playerType}_die`, true);
        this.setVelocityX(0);
        this.scene.time.delayedCall(1200, () => {
            this.scene.scene.start('GameOverScene', { playerType: this.playerType });
        });
    }

    // ─────────────────────────────────────────────────
    //  ABILITY UNLOCK
    // ─────────────────────────────────────────────────
    unlockAbility(ability) {
        switch (ability) {
            case 'speed_attack': this.hasSpeedAttack = true; break;
            case 'rapid_shot':   this.hasRapidShot   = true; break;
            case 'shield':       this.hasShield       = true; break;
            case 'dash':         this.hasDash         = true; break;
            case 'ultimate':     this.hasUltimate     = true; break;
        }
    }

    addScore(points) {
        this.score += points;
    }
}
