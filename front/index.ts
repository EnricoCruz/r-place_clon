import p5 from 'p5';
import { io } from 'socket.io-client';
import { IPixelData, IPixelSimpleData } from '../types/socket.io';


const socket = io('http://localhost:3000/');

socket.on('server-emit-test', (data) => {
    console.log('test-data:', data);
});


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

function generateInitialPixelsState(pixelsX: number, pixelsY: number): IPixelSimpleData[]
{
    let pixels = new Array<IPixelSimpleData>();
    let i = 0;
    for (let x = 0; x < pixelsX; x++)
    {
        for (let y = 0; y < pixelsY; y++)
        {
            pixels.push({id: i++, x: x, y: y, color: 'white'});
        }
    }
    return pixels;
}

function drawPixelCanvas(p5: p5, pixels: IPixelSimpleData[], zoom: number)
{
    for (let i = 0; i < pixels.length; i++)
    {
        let plx = pixels[i].x;
        let ply = pixels[i].y;
        p5.fill(pixels[i].color);
        p5.square((plx * pixlSize * zoom),(ply * pixlSize * zoom), pixlSize * zoom);
    }
}

// TODO: Crear border highlight para el color seleccionado (filtrar el borde para contrastar correctamente con los distintos colores (crear un filtro por array para saber cuales combinan y cuales no.))
// TODO: Add a minimize icon to pallete to hide some part of the canvas

const len: number = colors.length;
const bor: number = 4; // border width pixels
function drawColorsPallete(p5: p5, colors: string[])
{
    const gap: number = (p5.width - (bor * 2)) / len;

    // Pad Bar
    p5.fill('rgba(60, 60, 60, 0.75)');
    p5.rect(0, p5.height - (gap +  bor*2), p5.width, gap + bor*2);

    // Show Colores
    for (let i = 0; i < len; i++)
    {
        p5.fill(colors[i]);
        p5.square(i * gap + bor, p5.height - (gap + bor), gap);
    }
}

function changeSelectedColorHandler(p5: p5, selectedColor: string, colors: string[]) : string
{   
    
    // Filter to work only if cursor is in Collors Pallete

    let newSelectedColor = colors[Math.floor((p5.mouseX / p5.width) * colors.length)];

    if (newSelectedColor) 
    {
        return newSelectedColor;
    }
    else return selectedColor;
}

function updateCanvasPixelsFromDDBB(pixels: IPixelSimpleData[], loadedData: IPixelData[])
{
    pixels.map((pixel: IPixelSimpleData) => loadedData.find((data: IPixelData) => {
        if (data.pixelid === pixel.id) pixel.color = data.color;
    }))
}

const replacePixelColor = function(pixels: IPixelSimpleData[], x: number, y: number, newColor: string, emit: boolean = true)
{
    // console.log(x, y);
    let i = pixels.findIndex((pixel) => (pixel.x === x && pixel.y === y));
    if (i !== -1) 
    {
        pixels[i].color = newColor;
        if (emit) 
        {
            socket.emit('client-emit-newplace', {userid: 0, pixelid: i, color: newColor, time: Date.now()});
        }
        else
        {
            console.log('color replaced');
        }
    }
    else console.log(`Pixel: (${x} | ${y}) not found!!`);
}

const isCursorInMenu = function(p5: p5): boolean
{
    const gap: number = (p5.width - (bor * 2)) / len;

    let afterCanvasXStart   = p5.mouseX >= 0;
    let beforeCanvasXEnd    = p5.mouseX < p5.width;
    let belowPalleteTopLine = p5.mouseY >= p5.height - gap;
    let overCanvasBottomGap = p5.mouseY <= p5.height;

    return afterCanvasXStart && beforeCanvasXEnd && belowPalleteTopLine && overCanvasBottomGap;
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
const pixelsX = 100;
const pixelsY = 100;
const pixels: IPixelSimpleData[] = generateInitialPixelsState(pixelsX, pixelsY);

// Event State Booleans
let isZooming: boolean = false;
let isDragging: boolean = false;


const   pixlSize            = 10;               // each square size
let     canvasOffset        = {x: 0, y: 0}      // Canvas Offset
let     ScreenOffset        = {x: 0, y: 0}      // Canvas Offset
let     zoom                = 3;                // scroll zoom
let     currentPixelCoords  = {x: 0, y: 0}      // Mouse over Coords on screen
let     activeColor: string = colors[0];        // Selected Color to draw in Canvas


socket.on('server-emit-newpixel', (data: IPixelData) => {
    let i: number = pixels.findIndex(pixel => data.pixelid === pixel.id);
    replacePixelColor(pixels, pixels[i].x, pixels[i].y, data.color, false);
});

function sketch(p5:  p5) 
{
    p5.setup = () => {
        const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
        canvas.parent('canvas');
        // p5.background('gray');
        p5.noStroke();
        p5.frameRate(32);

        socket.on('server-emit-pixels', (data: IPixelData[]) => updateCanvasPixelsFromDDBB(pixels, data))        
    }

    p5.draw = () => {
        p5.background('gray');

        // TODO: update canvas offset when mouse is scrolling (use similar to place formula)


        // p5.translate(-ScreenOffset.x, -ScreenOffset.y);
        p5.translate(canvasOffset.x, canvasOffset.y);
        drawPixelCanvas(p5, pixels, zoom);
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
            if (!isDragging) replacePixelColor(pixels, currentPixelCoords.x, currentPixelCoords.y, activeColor);
            else isDragging = false;
        } 
    }

    // TODO: Mover a generador de funcion para alertar de cuando no se está en ningún pixel.
    p5.mouseMoved = (event: any) => {
        currentPixelCoords = {
            x: Math.floor((-canvasOffset.x/(zoom*pixlSize)) + ((p5.mouseX * pixlSize)/(pixelsX * zoom))),
            y: Math.floor((-canvasOffset.y/(zoom*pixlSize)) + (p5.mouseY*pixlSize/(pixelsY * zoom)))
        }
    }

    // p5.mouseReleased = (event: any) => {
    //     console.log('mouseReleased');
    //     if (isDragging) isDragging = false;
    // }
}

new p5(sketch);