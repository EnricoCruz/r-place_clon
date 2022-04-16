import { IPixelSimpleData } from "../../types/p5.pixel";
import { IPixelData } from "../../types/socket.io";
import p5 from 'p5';

export default class CanvasHandler
{
    // Pixel construction
    protected static pixelsX = 350; // initial 100
    protected static pixelsY = 350; // initial 100
    protected static offsetX = 0;
    protected static offsetY = 0;
    protected static zoom       = 1;
    protected static pixlSize   = 10;
    private static pixels: IPixelSimpleData[] = CanvasHandler.generateInitialPixelsState(CanvasHandler.pixelsX, CanvasHandler.pixelsY);
    private p5: p5;
    constructor(p5: p5)
    {
        this.p5 = p5;
    }

    private static generateInitialPixelsState(pixelsX: number, pixelsY: number): IPixelSimpleData[]
    {
        let pixels = new Array<IPixelSimpleData>();
        let i = 0;
        for (let y = 0; y < pixelsY; y++)
        {
            for (let x = 0; x < pixelsX; x++)
            {
                pixels.push({id: i++, x: x, y: y, color: 'white'});
            }
        }
        return pixels;
    }


    public loadCanvasPixelsFromDDBB(loadedData: IPixelData[])
    {
        console.log('loading pixels');
        CanvasHandler.pixels.map((pixel: IPixelSimpleData) => loadedData.find((data: IPixelData) => {
            if (data.pixelid === pixel.id) pixel.color = data.color;
        }))
    }

    public drawPixelCanvas(zoom: number)
    {
        // const increm: number = zoom >= 1 ? 1 : zoom >= 0.5 ? 2: 4;
        const length: number = CanvasHandler.pixels.length;
        

        // Draw canvas again if not mode image
        for (let i = 0; i < length; i ++)
        {
            let plx = CanvasHandler.pixels[i].x * CanvasHandler.pixlSize * zoom;
            let ply = CanvasHandler.pixels[i].y * CanvasHandler.pixlSize * zoom;
            // Limitante
            if (plx + CanvasHandler.offsetX > this.p5.width + CanvasHandler.pixlSize) continue;
            if (plx + CanvasHandler.offsetX < -CanvasHandler.pixlSize*zoom*2) continue;
            if (ply + CanvasHandler.offsetY > this.p5.height + CanvasHandler.pixlSize) continue;
            if (ply + CanvasHandler.offsetY < -CanvasHandler.pixlSize*zoom*2) continue;
            if (zoom > 4) 
            {
                this.p5.strokeWeight(zoom / 4);
                this.p5.stroke('gray');
            }
            else this.p5.noStroke();
            if (zoom > 1 || true )
            {
                
                this.p5.fill(CanvasHandler.pixels[i].color);
                this.p5.square(plx,ply, CanvasHandler.pixlSize * zoom);
            }
        }


    }

    public replacePixelColorInCanvas(x: number, y: number, newColor: string): number
    {
        let i = CanvasHandler.pixels.findIndex((pixel) => (pixel.x === x && pixel.y === y));
        let pixel = CanvasHandler.pixels[i];
        if (pixel)
        {
            pixel.color = newColor;
            return i;
        }
        else return -1;
    }

    // Helpers
    public findPixelIndexById(id: number)
    {
        return CanvasHandler.pixels.findIndex(pixel => pixel.id === id);
    }
}