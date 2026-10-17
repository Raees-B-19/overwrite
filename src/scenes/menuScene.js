import {setScene} from '../engine.js';
import {makeMenu} from '../ui/menu.js';
import {gameScene} from './gameScene.js';

// The title screen, Play starts the game
export const menuScene =
{
    enter() { this.menu = makeMenu('OVERWRITE', [['Play', ()=> setScene(gameScene)]]); },
    leave() { this.menu.destroy(); },
};
