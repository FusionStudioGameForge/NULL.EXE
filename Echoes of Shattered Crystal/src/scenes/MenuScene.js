// src/scenes/MenuScene.js
import { SCENES, GAME } from '../utils/constants.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super(SCENES.MENU);
    }

    create() {
        this.add.text(GAME.WIDTH/2, 200, GAME.TITLE, {
            fontSize: '48px',
            fill: '#fff'
        }).setOrigin(0.5);

        const startBtn = this.add.text(GAME.WIDTH/2, 400, 'START JOURNEY', {
            fontSize: '42px',
            fill: '#0f0'
        }).setOrigin(0.5).setInteractive();

        startBtn.on('pointerdown', () => {
            this.scene.start(SCENES.CHARACTER_SELECT);
        });

        this.add.text(GAME.WIDTH/2, 550, 'Press START to defend the village', {
            fontSize: '22px',
            fill: '#aaa'
        }).setOrigin(0.5);
    }
}