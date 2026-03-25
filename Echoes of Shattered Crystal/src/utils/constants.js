// src/utils/constants.js
// =============================================
// Central constants file - prevents typos and makes code easy to maintain
// Very useful for hackathon when you need to change scene names quickly
// =============================================

export const SCENES = {
    BOOT: 'BootScene',
    MENU: 'MenuScene',
    CHARACTER_SELECT: 'CharacterSelectScene',
    VILLAGE: 'VillageScene',       // Chapter 1 - Village of Shadows
    FOREST: 'ForestScene',         // Chapter 2 - Forest of Whispers
    GRAVEYARD: 'GraveyardScene',   // Chapter 3 - The Dead Man's Elm
    VOLCANO: 'VolcanoScene',       // Chapter 4 - Volcano of Flames
    MOUNTAIN: 'MountainScene'      // Chapter 5 - Final Mountain + Boss + Endings
};

export const PLAYER = {
    ARIA: 'aria',      // Female archer - ranged combat
    ORION: 'orion'     // Male swordsman - melee combat
};