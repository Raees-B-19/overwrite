import {vec2, vec3, setScene, setPaused, keyWasPressed, render3D, EngineObject3D,
    CameraControl3D, drawTextScreen, mainCanvasSize} from '../engine.js';
import {palette, ARENA_SIZE, UI_HEIGHT} from '../config.js';
import {makeMenu} from '../ui/menu.js';
import {menuScene} from './menuScene.js';

// The game: a placeholder arena of floor tiles and the suit as a box, until the Phase 1 combat slice replaces it
export const gameScene =
{
    enter()
    {
        const offset = (ARENA_SIZE - 1)/2;  // centre the arena on the origin
        for (let x = 0; x < ARENA_SIZE; ++x)
        for (let z = 0; z < ARENA_SIZE; ++z)
        {
            const color = (x + z)%2 ? palette.tileDark : palette.tileLight;
            const tile = new EngineObject3D(vec3(x - offset, -.1, z - offset), render3D.boxMesh, undefined, color);
            tile.scale3D = vec3(.95, .2, .95);  // the gap shows the grid
        }

        const suit = new EngineObject3D(vec3(.5, .6, .5), render3D.boxMesh, undefined, palette.suit);
        suit.scale3D = vec3(.6, 1.2, .6);

        new CameraControl3D(vec3(), 14, .8);  // tactical angle, drag to orbit, wheel to zoom
    },
    leave() { this.closePause(); },
    updatePost()
    {
        if (keyWasPressed('Escape'))
            this.togglePause();
    },
    // the open menu is the pause state, the engine's paused flag can also be set by the debug tools
    togglePause()
    {
        if (this.pauseMenu)
            return this.closePause();
        setPaused(true);
        this.pauseMenu = makeMenu('PAUSED',
            [['Resume', ()=> this.closePause()], ['Main Menu', ()=> setScene(menuScene)]]);
    },
    closePause()
    {
        setPaused(false);
        this.pauseMenu?.destroy();
        this.pauseMenu = undefined;
    },
    renderPost()
    {
        const scale = mainCanvasSize.y/UI_HEIGHT;  // same scale as the menus
        if (!this.pauseMenu)
            drawTextScreen('Drag: orbit   Wheel: zoom   Esc: pause',
                vec2(mainCanvasSize.x/2, mainCanvasSize.y - 30*scale), 24*scale, palette.text);
    },
};
