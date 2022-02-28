/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 */

import './index.css';
import World from './assets/hello-world.png'

import * as PIXI from "pixi.js"
// import { install } from '@pixi/unsafe-eval';
import * as dat from 'dat.gui'
import { Sprite } from 'pixi.js';

// let stats: any;

// const ShaderSystem = PIXI.ShaderSystem
// install({ ShaderSystem })

const load = (app: PIXI.Application) => {
    return new Promise<void>((resolve: () => void) => {
        app.loader.add('world', World).load(() => {
            resolve();
        });
    });
};

export const main = async (): Promise<void> => {
    // Actual app
    let app = new PIXI.Application({ antialias: true, backgroundColor: 0x111111 });

	console.log('hello, electron')

    // window.electronAPI.updateSpriteX((event: any, value: any) => {
    //     console.log(value)
    //     sprite.x = value * window.innerWidth;
    // })

	window.electronAPI.handleBackground((event:any, value: any) => {
		console.log(event)
		console.log(value)
		app.renderer.backgroundColor = value
	})

    // Display application properly
    document.body.style.margin = '0';
    app.renderer.view.style.position = 'absolute';
    app.renderer.view.style.display = 'block';

    // View size = windows
    app.renderer.resize(window.innerWidth, window.innerHeight);

    // Load assets
    await load(app);
    let sprite = new PIXI.Sprite(
        app.loader.resources.world.texture
    );
    sprite.scale.set(0.3,0.3)
    sprite.x = window.innerWidth / 2 - sprite.width / 2;
    sprite.y = window.innerHeight / 2 - sprite.height / 2;
    app.stage.addChild(sprite);

    // Handle window resizing
    window.addEventListener('resize', (_e) => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        sprite.x = window.innerWidth / 2 - sprite.width / 2;
        sprite.y = window.innerHeight / 2 - sprite.height / 2;
    });

    document.body.appendChild(app.view);

    let context = {
        velocity: { x: 1, y: 1 },
        sprite
    };

    let gui = new dat.GUI();

    app.ticker.add(update, context);
};

// Cannot be an arrow function. Arrow functions cannot have a 'this' parameter.
function update(this: any, delta: number) {
    
    // console.log(this.sprite.x)
    // if(this.sprite.x > window.innerWidth/2.0){
    //     window.electronAPI.writeLEDStatus(1)
    // } else {
    //     window.electronAPI.writeLEDStatus(0)
    // }
};

main();

export interface IElectronAPI {
	handleBackground: (callback: (event:any, value:any) => void) => void,
    // updateSpriteX: (callback: (event:any, value:any) => void) => void,
    // writeLEDStatus: (onOff:1|0) => any
}

declare global {
	interface Window {
		electronAPI: IElectronAPI
	}
}