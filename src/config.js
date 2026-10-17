import {hsl} from './engine.js';

// The limited palette, every colour in the game comes from here
export const palette =
{
    skyTop:     hsl(.62, .45, .08),
    skyHorizon: hsl(.58, .35, .25),
    ground:     hsl(.6,  .2,  .08),
    tileLight:  hsl(.58, .12, .3),
    tileDark:   hsl(.58, .12, .22),
    suit:       hsl(.5,  .7,  .5),
    panel:      hsl(.6,  .3,  .12, .9),
    button:     hsl(.58, .25, .22),
    hover:      hsl(.5,  .6,  .35),
    disabled:   hsl(.6,  .1,  .15),
    line:       hsl(.5,  .7,  .5),
    text:       hsl(.5,  .2,  .92),
};

export const UI_HEIGHT = 720;  // UI coordinates are laid out for this screen height and scaled to fit
export const ARENA_SIZE = 10;  // tiles per side of the placeholder arena
