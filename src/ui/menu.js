import {vec2, UIObject, UIText, UIButton} from '../engine.js';
import {palette} from '../config.js';

// A panel with a title over a column of buttons, shared by the main and pause menus
// buttons is a list of [label, onClick]; destroy the returned root to remove the menu
export function makeMenu(title, buttons)
{
    const buttonGap = 90;
    const root = new UIObject(vec2(), vec2(520, 220 + buttons.length*buttonGap));
    root.color = palette.panel;
    const top = -root.size.y/2;
    root.addChild(new UIText(vec2(0, top + 80), vec2(480, 100), title));

    buttons.forEach(([label, onClick], i)=>
    {
        const button = new UIButton(vec2(0, top + 190 + i*buttonGap), vec2(320, 70), label);
        button.navigationIndex = i + 1;    // keyboard and gamepad move through the buttons in order
        button.navigationAutoSelect = !i;  // the first button starts selected
        button.onClick = onClick;
        root.addChild(button);
    });
    return root;
}
