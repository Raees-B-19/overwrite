import {test} from 'node:test';
import assert from 'node:assert/strict';
import {setHeadlessMode, setEngineManualStep, engineStep, getScene, getPaused, uiSystem} from '../src/engine.js';

// the debug build's 3D editor reads document.pointerLockElement each update, even headless
globalThis.document ??= {};

// headless must be set before main.js starts the engine
setHeadlessMode(true);
setEngineManualStep(true);
await import('../src/main.js');
uiSystem.nativeHeight = 0;  // headless has no canvas, its size is 0 and native scaling would divide by it
const {menuScene} = await import('../src/scenes/menuScene.js');
const {gameScene} = await import('../src/scenes/gameScene.js');

// input is not synthesized headless, so press a button by calling its onClick
const findButton = (text)=> uiSystem.uiObjects.find((o)=> o.text === text);
const click = (text)=> findButton(text).onClick();

test('play starts the game, pause resumes, main menu returns to the title', ()=>
{
    assert.equal(getScene(), menuScene);

    click('Play');
    engineStep(10);
    assert.equal(getScene(), gameScene);
    assert.equal(findButton('Play'), undefined);

    gameScene.togglePause();
    assert.ok(getPaused());

    // main.js must keep calling updatePost while paused, or Esc could never unpause
    const updatePost = gameScene.updatePost;
    let calls = 0;
    gameScene.updatePost = ()=> ++calls;
    engineStep();
    gameScene.updatePost = updatePost;
    assert.ok(calls);

    click('Resume');
    engineStep();
    assert.ok(!getPaused());
    assert.equal(findButton('Resume'), undefined);

    gameScene.togglePause();
    click('Main Menu');
    engineStep();
    assert.equal(getScene(), menuScene);
    assert.ok(!getPaused());
    assert.equal(findButton('Main Menu'), undefined);
    assert.ok(findButton('Play'));
});
