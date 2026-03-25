// src/scenes/CharacterSelectScene.js
import { SCENES, PLAYER } from '../utils/constants.js';

export default class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super(SCENES.CHARACTER_SELECT);
    }

    create() {
        this.add.text(640, 120, 'CHOOSE YOUR HUNTER', {
            fontSize: '48px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Aria - Archer
        this.add.text(400, 280, 'ARIA\nFast Ranged Archer', {
            fontSize: '32px',
            fill: '#00ffff',
            align: 'center'
        }).setOrigin(0.5);

        const ariaBtn = this.add.rectangle(400, 420, 180, 220, 0x00ffff, 0.15).setInteractive();
        ariaBtn.on('pointerdown', () => {
            this.scene.start(SCENES.VILLAGE, { playerType: PLAYER.ARIA });
        });

        // Orion - Swordsman
        this.add.text(880, 280, 'ORION\nBrave Melee Warrior', {
            fontSize: '32px',
            fill: '#ff8800',
            align: 'center'
        }).setOrigin(0.5);

        const orionBtn = this.add.rectangle(880, 420, 180, 220, 0xff8800, 0.15).setInteractive();
        orionBtn.on('pointerdown', () => {
            this.scene.start(SCENES.VILLAGE, { playerType: PLAYER.ORION });
        });
    }
}