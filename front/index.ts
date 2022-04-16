import p5 from 'p5';
import { IPixelSimpleData } from '../types/p5.pixel';
import { IPixelData } from '../types/socket.io';

import SocketHandler from './script/SocketHandler';
import CanvasHandler from './script/CanvasHandler';
// import { io } from 'socket.io-client';
// import { IPixelData, IPixelSimpleData } from '../types/socket.io';


// const socket = io('http://192.168.1.33:3000/');
// const socket = io();




const colors: string[] = [
    '#6d001a', '#be0039', '#ff4500', '#ffa800', '#ffd635',
    '#fff8b8', '#00a368', '#00cc78', '#7eed56', '#00756f',
    '#009eaa', '#00ccc0', '#2450a4', '#3690ea', '#51e9f4',
    '#493ac1', '#6a5cff', '#94b3ff', '#811e9f', '#b44ac0',
    '#e4abff', '#de107f', '#ff3881', '#ff99aa', '#6d482f',
    '#9c6926', '#ffb470', '#000000', '#515252', '#898d90',
    '#d4d7d9', '#ffffff'
];

function getRandomColor(colors: string[])
{
    
    return colors[Math.floor(Math.random() * colors.length)];
}

function getTrueRandomColor()
{
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
}


function getVerticalGradientBgColor(color_a: number, color_b: number, brightness: number = 100, skip: number = 0) : string
{
    brightness = brightness >= 255 ? 255 : brightness <= 0 ? 0 : brightness;
    let a = color_a < 0 ? 0 : color_a > 255 ? color_a % 256 : color_a;
    let b = color_b < 0 ? 0 : color_b > 255 ? color_b % 256 : color_b;
    if (skip === 0) return `rgb(${brightness}, ${color_a}, ${color_b})`;
    else if (skip === 1) return `rgb(${color_a}, ${brightness}, ${color_b})`;
    else return `rgb(${color_a}, ${color_b}, ${brightness})`;
}


// TODO: mejorar la interfaz gráfica del color activo
// TODO: Add a minimize icon to pallete to hide some part of the canvas

const len: number = colors.length;
const bor: number = 4; // border width pixels
function drawColorsPallete(p5: p5, colors: string[])
{

    // Pad Bar
    p5.fill('rgba(60, 60, 60, 0.75)');
    p5.rect(xcenter, p5.height - (gap +  bor*2) -10, paw, gap + bor*2);

    // Show Colores
    for (let i = 0; i < len; i++)
    {
        // Selected Color
        if (colors[i] === activeColor)
        {
            let strokeColor = p5.color('white');
            strokeColor.setAlpha(0.8);
            p5.fill(colors[i]);
            p5.rect(i * gap + xcenter , p5.height - (gap + bor*2) -10, gap, gap + (bor*2));
            p5.stroke(strokeColor);
            p5.strokeWeight(5);
            p5.noStroke();
        }
        else
        {
        }
        p5.fill(colors[i]);
        p5.square((i * gap) + bor + xcenter, p5.height - (gap) -10, gap- 2*bor);
        p5.noStroke();
    }
}

function changeSelectedColorHandler(p5: p5, selectedColor: string, colors: string[]) : string
{   
    const paw: number = p5.width <= 960 ? p5.width : 960;
    const xcenter: number = p5.width/2 - paw/2;
    // Filter to work only if cursor is in Collors Pallete

    let click = Math.floor(((p5.mouseX -xcenter) / paw) * colors.length);
    let newSelectedColor = colors[click];

    if (newSelectedColor) 
    {
        return newSelectedColor;
    }
    else return selectedColor;
}

// function updateCanvasPixelsFromDDBB(pixels: IPixelSimpleData[], loadedData: IPixelData[])
// {
//     pixels.map((pixel: IPixelSimpleData) => loadedData.find((data: IPixelData) => {
//         if (data.pixelid === pixel.id) pixel.color = data.color;
//     }))
// }

// const replacePixelColor = function(pixels: IPixelSimpleData[], x: number, y: number, newColor: string, emit: boolean = true)
// {

//     let i = pixels.findIndex((pixel) => (pixel.x === x && pixel.y === y));
//     if (i !== -1) 
//     {
//         pixels[i].color = newColor;
//         if (emit) 
//         {
//             socket.emit('client-emit-newplace', {userid: 0, pixelid: i, color: newColor, time: Date.now()});
//         }
//         else
//         {
//             console.log('color replaced');
//         }
//     }
//     else console.log(`Pixel: (${x} | ${y}) not found!!`);
// }

const isCursorInMenu = function(p5: p5): boolean
{

    let afterPadMenuXStart  = p5.mouseX >= xcenter - paw/2;
    let beforaPadXEnd       = p5.mouseX < xcenter + paw;
    let belowPalleteTopLine = p5.mouseY >= p5.height - gap -10;
    let overCanvasBottomGap = p5.mouseY <= p5.height -10;

    return afterPadMenuXStart && beforaPadXEnd && belowPalleteTopLine && overCanvasBottomGap;
}


/**
 * * Debug function 
 * Shows cursor's coords in canvas
 * @param x Position in (X) axis
 * @param y Position in (Y) axis
 * @param size Font size in pixels (20 by default)
 * @param color Font color (white by default)
 */
function debug_showCursorCoords(p5: p5, x: 'LEFT' | 'CENTER' | 'RIGHT', y: 'TOP' | 'MIDDLE' | 'BOTTOM', size: number = 16, color: p5.Color = p5.color('white'))
{
    p5.textSize(size);
    p5.fill(color);

    // Set text coords depending on x | y constants
    let coordx:number, coordy: number = 0;
    let textAlign: p5.LEFT | p5.CENTER | p5.RIGHT;
    switch (x)
    {
        case 'LEFT': 
            coordx = size;
            textAlign = p5.LEFT;
        break;
        case 'CENTER': 
            coordx = p5.width  / 2;
            textAlign = p5.CENTER;
        break;
        case 'RIGHT':
            coordx = (p5.width - size);
            textAlign = p5.RIGHT;
        break;
    }
    switch (y)
    {
        case 'TOP':
            coordy = size * 2;
        break;
        case 'MIDDLE': 
            coordy = p5.height / 2;
        break;
        case 'BOTTOM':
            coordy = p5.height - size * 2;
        break;
    }

    // Draw Text
    p5.textAlign(textAlign);
    p5.text(`Mouse Coords: (${p5.mouseX} | ${p5.mouseY})`, coordx, coordy);
}


// Debug Variables
const debugMouseCoords: boolean = true;  // Shows cursor coords in screen


// Pixel construction
const pixelsX = 350; // initial 100
const pixelsY = 350; // initial 100
// const pixels: IPixelSimpleData[] = generateInitialPixelsState(pixelsX, pixelsY);

// Event State Booleans
let isZooming: boolean = false;
let isDragging: boolean = false;


const   pixlSize            = 10;               // each square size
let     canvasOffset        = {x: 0, y: 0}      // Canvas Offset
let     zoom                = 3;                // scroll zoom
let     currentPixelCoords  = {x: 0, y: 0}      // Mouse over Coords on screen
let     activeColor: string = colors[0];        // Selected Color to draw in Canvas
let     image: p5.Image;
let     mdimg: boolean      = zoom <= 1 ? true : false;

// Pallete Pad vars
let paw: number;
let gap: number;
let xcenter: number;

// socket.on('server-emit-newpixel', (data: IPixelData) => {
//     let i: number = pixels.findIndex(pixel => data.pixelid === pixel.id);
//     replacePixelColor(pixels, pixels[i].x, pixels[i].y, data.color, false);
// });

// Handlers
let socketHandler: SocketHandler;
let canvasHandler: CanvasHandler;

function sketch(p5:  p5) 
{
    p5.setup = () => {
        const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
        image = p5.createImage(pixelsX, pixelsY);
        canvas.parent('canvas');
        p5.frameRate(60);

        socketHandler = new SocketHandler(p5);
        canvasHandler = new CanvasHandler(p5);
        paw = p5.width <= 960 ? p5.width : 960;
        gap = (paw - (bor * 2)) / len;
        xcenter = p5.width/2 - paw/2;
    }

    p5.draw = () => {
        p5.background('gray');


        // p5.translate(-ScreenOffset.x, -ScreenOffset.y);
        p5.translate(canvasOffset.x, canvasOffset.y);
        canvasHandler.drawPixelCanvas(zoom);
        p5.translate(-canvasOffset.x, -canvasOffset.y);


        // Screen Overlay
        if (debugMouseCoords) debug_showCursorCoords(p5, 'RIGHT', 'TOP');
        drawColorsPallete(p5, colors);
    }

    // Event Listeners
    p5.mouseWheel = (event: any) => {
        const min: number = 0.4;
        const max: number = 10;
        const dir: number = event.delta > 0 ? 1 : -1;
        zoom -= (event.delta * 0.005);
        if (zoom < min) zoom = min;
        else if (zoom > max) zoom = max; 
        // if (zoom !== min && zoom !== max) offset = {x: offset.x + dir * (p5.mouseX - (p5.displayWidth / 2)) / zoom , y: offset.y + dir * (p5.mouseY - (p5.displayHeight / 2)) / zoom };
        console.log('scrolling ->', zoom);
        // console.log('offset ->', offset);
        isZooming = true;
    }

    p5.mouseDragged = (event: any) => {
        if (!isDragging) isDragging = true;
        if (isCursorInMenu(p5))
        {
        }
        else
        {
            canvasOffset = {x: canvasOffset.x + (p5.movedX), y: canvasOffset.y + (p5.movedY)}
        }
        // console.log(canvasOffset);
    }

    p5.mouseClicked = (event: any) => {

    
        // Color Pallete
        if (isCursorInMenu(p5))
        {   
            activeColor = changeSelectedColorHandler(p5, activeColor, colors);
        }   
        // Rest of Canvas
        else
        {
            if (!isDragging) socketHandler.replacePixelColor(currentPixelCoords.x, currentPixelCoords.y, activeColor);
            else isDragging = false;
        } 
    }

    // TODO: Mover a generador de funcion para alertar de cuando no se está en ningún pixel.
    p5.mouseMoved = (event: any) => {
        currentPixelCoords = {
            x: Math.floor((-canvasOffset.x/(zoom*pixlSize)) + ((p5.mouseX * pixlSize)/(100 * zoom))),
            y: Math.floor((-canvasOffset.y/(zoom*pixlSize)) + (p5.mouseY*pixlSize/(100 * zoom)))
        }
    }

    p5.windowResized = (event: any) => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    // p5.mouseReleased = (event: any) => {
    //     console.log('mouseReleased');
    //     if (isDragging) isDragging = false;
    // }
}

new p5(sketch);