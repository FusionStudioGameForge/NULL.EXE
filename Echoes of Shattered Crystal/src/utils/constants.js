// src/utils/constants.js
// =============================================
// Central constants for the entire game
// =============================================

export const SCENES = {
    BOOT:             'BootScene',
    MENU:             'MenuScene',
    CHARACTER_SELECT: 'CharacterSelectScene',
    VILLAGE:          'VillageScene',
    FOREST:           'ForestScene',
    GRAVEYARD:        'GraveyardScene',
    VOLCANO:          'VolcanoScene',
    MOUNTAIN:         'MountainScene',
    GAME_OVER:        'GameOverScene',
    VICTORY:          'VictoryScene',
};

export const PLAYER = {
    ARIA: {
        key:          'aria',
        name:         'Aria',
        title:        'The Skilled Archer',
        speed:        320,
        jumpVelocity: -620,
        health:       90,
        attackDamage: 18,
        attackRange:  500,   // ranged
        color:        0x00ffff,
    },
    ORION: {
        key:          'orion',
        name:         'Orion',
        title:        'The Brave Swordsman',
        speed:        280,
        jumpVelocity: -650,
        health:       120,
        attackDamage: 25,
        attackRange:  80,    // melee
        color:        0xff8800,
    },
};

export const ENEMIES = {
    BANDIT: {
        key:    'bandit',
        health: 40,
        damage: 10,
        speed:  120,
        score:  50,
    },
    GOBLIN: {
        key:    'goblin',
        health: 30,
        damage: 8,
        speed:  160,
        score:  40,
    },
    WOLF: {
        key:    'wolf',
        health: 50,
        damage: 12,
        speed:  180,
        score:  60,
    },
    SHADOW_BEAST: {
        key:    'shadow_beast',
        health: 70,
        damage: 15,
        speed:  140,
        score:  80,
    },
    SKELETON: {
        key:    'skeleton',
        health: 55,
        damage: 12,
        speed:  100,
        score:  65,
    },
    FIRE_SKELETON: {
        key:    'fire_skeleton',
        health: 75,
        damage: 18,
        speed:  110,
        score:  90,
    },
    LAVA_BEAST: {
        key:    'lava_beast',
        health: 120,
        damage: 22,
        speed:  90,
        score:  120,
    },
    DRAGON: {
        key:    'dragon',
        health: 400,
        damage: 35,
        speed:  60,
        score:  500,
    },
};

export const ABILITIES = {
    SPEED_ATTACK: { name: 'Speed Attack',  key: 'speed_attack', unlockedChapter: 2 },
    RAPID_SHOT:   { name: 'Rapid Shot',    key: 'rapid_shot',   unlockedChapter: 2 },
    SHIELD:       { name: 'Shield Block',  key: 'shield',       unlockedChapter: 3 },
    DASH:         { name: 'Dash',          key: 'dash',         unlockedChapter: 4 },
    ULTIMATE:     { name: 'Crystal Blast', key: 'ultimate',     unlockedChapter: 5 },
};

export const COLORS = {
    WHITE:   '#ffffff',
    GOLD:    '#ffd700',
    CYAN:    '#00ffff',
    ORANGE:  '#ff8800',
    GREEN:   '#00ff88',
    PURPLE:  '#cc88ff',
    RED:     '#ff4444',
    MAGENTA: '#ff00ff',
    DARK:    '#1a0a2e',
};

export const GAME = {
    WIDTH:  1280,
    HEIGHT: 720,
    GROUND_Y: 580,
};
