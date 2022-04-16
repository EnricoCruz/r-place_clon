import p5 from 'p5';
import { io, Socket } from 'socket.io-client';
import { IPixelSimpleData } from '../../types/p5.pixel';
import { IClientToServerEvents, IPixelData, IServerToClientEvents } from '../../types/socket.io';
import CanvasHandler from './CanvasHandler';

export default class SocketHandler
{
    private static debug: boolean = true;
    private static socket = io();
    private canvasHandler: CanvasHandler;
    constructor(p5: p5)
    {
        this.canvasHandler = new CanvasHandler(p5);
        if (SocketHandler.debug) this.testingMethods();
        this.listenServerEvents();
    }

    private testingMethods()
    {
        SocketHandler.socket.on('server-emit-test', (data: any) => {
            console.log('test-data:', data);
        });

    }

    public replacePixelColor(x: number, y:number, newColor: string, emit: boolean = true)
    {
        let i = this.canvasHandler.replacePixelColorInCanvas(x, y, newColor);
        if (i !== -1) 
        {
            if (emit) 
            {
                SocketHandler.socket.emit('client-emit-newplace', {userid: 0, pixelid: i, color: newColor, time: Date.now()});
            }
            else
            {
                console.log('color replaced');
            }
        }
        else console.log(`Pixel: (${x} | ${y}) not found!!`);
    }

    public listenServerEvents()
    {
        // Download Initial Canvas State
        SocketHandler.socket.on('server-emit-pixels', (data: IPixelData[]) => this.canvasHandler.loadCanvasPixelsFromDDBB(data));

        // Listen for new pixel updates
        SocketHandler.socket.on('server-emit-newpixel', (data: IPixelData) => {
            let pixel: IPixelSimpleData = (<IPixelSimpleData>this.canvasHandler.findPixelById((<number>data.id)));
            this.replacePixelColor(pixel.x, pixel.y, data.color, false);
        });
    }
}
