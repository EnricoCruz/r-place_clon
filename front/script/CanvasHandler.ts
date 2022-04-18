import { IPixelCoordsData, IPixelSimpleData } from "../../types/p5.pixel";
import { IPixelData } from "../../types/socket.io";
import p5 from 'p5';

export default class CanvasHandler
{
    // Pixel construction
    protected static pixelsX = 1200; // initial 100
    protected static pixelsY = 1200; // initial 100
    protected static offsetX = 0;
    protected static offsetY = 0;
    protected static zoom       = 1;
    protected static pixlSize   = 10;
    private static pixels: IPixelSimpleData[][] = CanvasHandler.generateInitialPixelsState(CanvasHandler.pixelsX, CanvasHandler.pixelsY);
    private p5: p5;
    constructor(p5: p5)
    {
        this.p5 = p5;
    }

    private static generateInitialPixelsState(pixelsX: number, pixelsY: number): IPixelSimpleData[][]
    {
        let pixels: IPixelSimpleData[][] = new Array<IPixelSimpleData[]>();
        let i = 0;
        for (let y = 0; y < pixelsY; y++)
        {
            let pixelRow: IPixelSimpleData[] = []
            for (let x = 0; x < pixelsX; x++)
            {
                pixelRow.push({id: i++, color: '#ffffff'})
            }
            pixels.push(pixelRow);
        }
        return pixels;
    }


    public loadCanvasPixelsFromDDBB(loadedData: IPixelData[])
    {
        console.log('loading pixels');

        loadedData.forEach(data => {
            CanvasHandler.pixels[data.y][data.x].color = data.color;
        })

    }

    public drawPixelCanvas(zoom: number)
    {


        this.p5.translate(CanvasHandler.offsetX, CanvasHandler.offsetY);
        const jump: number = zoom < 0.5 ? 2 : 1;
        
        for (let y = 0; y + jump <= CanvasHandler.pixelsY; y += jump )
        {

            let wideRepeat = 0;
            for (let x = 0; x + jump <= CanvasHandler.pixelsX; x += jump )
            {
                // Lag Reducer by combining squares horizontally
                if (x + jump < CanvasHandler.pixelsX && CanvasHandler.pixels[y][x].color === CanvasHandler.pixels[y][x + jump].color)
                {
                    wideRepeat += jump;
                    continue;
                }
                let plx = x * CanvasHandler.pixlSize * zoom;
                let ply = y * CanvasHandler.pixlSize * zoom;

                // TODO: Crear limitante en el array directamente, para ahorrar mas recursos
                // if (plx - (wideRepeat * CanvasHandler.pixlSize * zoom) + CanvasHandler.offsetX > this.p5.width + CanvasHandler.pixlSize) continue;
                // if (plx + CanvasHandler.offsetX < -CanvasHandler.pixlSize*zoom*2) continue;
                // if (ply + CanvasHandler.offsetY > this.p5.height + CanvasHandler.pixlSize ) continue;
                // if (ply + CanvasHandler.offsetY < -CanvasHandler.pixlSize*zoom*2 ) continue;


                if (zoom < 0.5 && x > 0 && y && 0)
                {
                    // Lerp colors from 4 pixels
                    const lerpTop = this.p5.lerpColor(this.p5.color(CanvasHandler.pixels[y - 1][x-1].color), this.p5.color(CanvasHandler.pixels[y - 1][x-1].color), 0.5);
                    const LerpBottom = this.p5.lerpColor(this.p5.color(CanvasHandler.pixels[y][x-1].color), this.p5.color(CanvasHandler.pixels[y][x].color), 0.5);
                    this.p5.fill(this.p5.lerpColor(lerpTop, LerpBottom, 0.5));
                }
                else
                {   
                    this.p5.fill(CanvasHandler.pixels[y][x].color);      
                }
                this.p5.rect((CanvasHandler.pixlSize * (x - wideRepeat) * zoom),CanvasHandler.pixlSize * y * zoom, CanvasHandler.pixlSize * zoom * ((wideRepeat + jump) ), CanvasHandler.pixlSize * jump * zoom + 1);
                wideRepeat = 0;
            }
        }

        this.p5.translate(-CanvasHandler.offsetX, -CanvasHandler.offsetY);
        this.p5.noStroke();

    }

    public replacePixelColorInCanvas(x: number, y: number, newColor: string): number
    {
        // let i = CanvasHandler.pixels.findIndex((pixel) => (pixel.x === x && pixel.y === y));
        let pixel = CanvasHandler.pixels[y][x];
        if (pixel)
        {
            pixel.color = newColor;
            return 1;
        }
        else return -1;
    }

    public setCanvasOffset(x: number, y: number)
    {
        CanvasHandler.offsetX = x;
        CanvasHandler.offsetY = y;
    }

    public updateCanvasOffset(x: number, y: number)
    {
        CanvasHandler.offsetX += x;
        CanvasHandler.offsetY += y;
    }

    // Helpers
    // public findPixelIndexById(id: number)
    // {
    //     return CanvasHandler.pixels.findIndex(pixel => pixel.id === id);
    // }

    // public findPixelById(id: number): IPixelSimpleData | undefined
    // {
    //     // return CanvasHandler.pixels.find((pixel: IPixelSimpleData) => pixel.id === id);
    // }

    public getOffset(): {x: number, y: number}
    {
        return {x: CanvasHandler.offsetX, y: CanvasHandler.offsetY};
    }

    public getPixelSize(): number 
    {
        return CanvasHandler.pixlSize;
    }
}