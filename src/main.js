import {vec3, engineInit, setDebugKey, getScene, setScene, Render3DPlugin, render3D,
    UISystemPlugin, uiSystem} from './engine.js';
import {palette, UI_HEIGHT} from './config.js';
import {menuScene} from './scenes/menuScene.js';

// Esc pauses the game, so the debug overlay moves to the backquote key
setDebugKey('Backquote');

function gameInit()
{
    new Render3DPlugin;
    render3D.setSky(palette.skyTop, palette.skyHorizon, palette.ground);
    render3D.sunDirection = vec3(-.4, 1, .3);

    new UISystemPlugin;
    uiSystem.nativeHeight = UI_HEIGHT;
    uiSystem.defaultButtonColor = palette.button;
    uiSystem.defaultHoverColor = palette.hover;
    uiSystem.defaultDisabledColor = palette.disabled;
    uiSystem.defaultLineColor = palette.line;
    uiSystem.defaultTextColor = palette.text;
    uiSystem.defaultCornerRadius = 8;

    setScene(menuScene);
}

// Scenes may add an updatePost hook, it runs while paused so a scene can unpause itself
function gameUpdatePost() { getScene()?.updatePost?.(); }

await engineInit(gameInit, undefined, gameUpdatePost);
