import Scene from './scene.js';
import GameOver from './gameover.js';
import MainMenu from './mainmenu.js';

const config = {
    type: Phaser.AUTO,
    width: 336,
    height: 220,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scene: [MainMenu, Scene, GameOver],
};

new Phaser.Game(config);