// src/classes/Player.js
// =============================================
// Reusable Player class for both Aria and Orion
// Handles movement, jumping, attacking, and animations
// =============================================

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, playerType) {
        super(scene, x, y, playerType === 'aria' ? 'aria' : 'orion');

        this.scene = scene;
        this.playerType = playerType;   // 'aria' or 'orion'

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);   // Don't fall off screen
        this.setBounce(0.1);
        this.setDragX(800);                 // Friction when not moving

        // Player stats
        this.speed = 300;
        this.jumpVelocity = -650;
        this.health = 100;

        // Abilities (unlocked later in chapters)
        this.hasShield = false;
        this.hasDash = false;

        this.createAnimations();
        this.setupInput();
    }

    createAnimations() {
        const key = this.playerType;

        // Idle animation
        this.scene.anims.create({
            key: `${key}_idle`,
            frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        // Walk animation
        this.scene.anims.create({
            key: `${key}_walk`,
            frames: this.scene.anims.generateFrameNumbers(key, { start: 4, end: 9 }),
            frameRate: 12,
            repeat: -1
        });

        // Jump animation
        this.scene.anims.create({
            key: `${key}_jump`,
            frames: this.scene.anims.generateFrameNumbers(key, { start: 10, end: 12 }),
            frameRate: 10,
            repeat: 0
        });

        // Attack animation (different for each character)
        if (this.playerType === 'aria') {
            // Bow attack
            this.scene.anims.create({
                key: 'aria_attack',
                frames: this.scene.anims.generateFrameNumbers('aria', { start: 13, end: 16 }),
                frameRate: 15,
                repeat: 0
            });
        } else {
            // Sword attack
            this.scene.anims.create({
                key: 'orion_attack',
                frames: this.scene.anims.generateFrameNumbers('orion', { start: 13, end: 17 }),
                frameRate: 18,
                repeat: 0
            });
        }
    }

    setupInput() {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Attack on SPACE (or mouse click)
        this.spaceKey.on('down', () => this.attack());
    }

    update() {
        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.flipX = true;
            this.anims.play(`${this.playerType}_walk`, true);
        }
        else if (this.cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.flipX = false;
            this.anims.play(`${this.playerType}_walk`, true);
        }
        else {
            this.setVelocityX(0);
            this.anims.play(`${this.playerType}_idle`, true);
        }

        // Jumping
        if (this.cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(this.jumpVelocity);
            this.anims.play(`${this.playerType}_jump`, true);
        }

        // Dash ability (unlocked in Chapter 4)
        if (this.hasDash && this.shiftKey.isDown && this.canDash) {
            this.dash();
        }
    }

    attack() {
        if (this.isAttacking) return;
        this.isAttacking = true;

        if (this.playerType === 'aria') {
            this.anims.play('aria_attack', true);
            this.shootArrow();
        } else {
            this.anims.play('orion_attack', true);
            // Play sword sound if you add it later
            // this.scene.sound.play('sword_swing');
        }

        // Reset attack flag after animation
        this.scene.time.delayedCall(400, () => {
            this.isAttacking = false;
        });
    }

    shootArrow() {
        // Simple projectile for Aria
        const arrow = this.scene.physics.add.sprite(this.x + (this.flipX ? -40 : 40), this.y - 20, 'arrow');
        arrow.setVelocityX(this.flipX ? -600 : 600);
        arrow.setScale(0.8);

        // Destroy arrow after 2 seconds
        this.scene.time.delayedCall(2000, () => arrow.destroy());
    }

    dash() {
        this.canDash = false;
        const direction = this.flipX ? -1 : 1;

        this.setVelocityX(direction * 800);
        this.setTint(0x00ffff);

        this.scene.time.delayedCall(300, () => {
            this.setVelocityX(0);
            this.clearTint();
            this.canDash = true;
        });
    }

    takeDamage(amount) {
        this.health -= amount;
        this.setTint(0xff0000);
        
        this.scene.time.delayedCall(200, () => this.clearTint());

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.setVelocity(0);
        this.anims.stop();
        this.setTint(0x880000);
        console.log(`${this.playerType.toUpperCase()} has died!`);
        // You can trigger Game Over scene here later
    }
}