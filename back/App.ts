import path from 'path';
import Express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { IClientToServerEvents, IServerToClientEvents, IInterServerEvents, ISocketData, IPixelData } from '../types/socket.io';


const debugClient: boolean = false;

// Routers
import defaultRouter from './routers/default.router';
// Controllers
const socketIOController = require('./controllers/socketIO.controller');

export default class App
{
	private httpServer: http.Server;
    private app: Express.Application;
    private port: number;
    private host : string;
    private protocol : string;
    constructor(port: number = 3000, host: string = 'localhost', protocol: string = 'http')
    {
        this.app = Express();
        this.port = port;
        this.host = host;
        this.protocol = protocol;
		this.httpServer = http.createServer(this.app);

        this.setHeaders();
        this.setMiddlewares();
        this.setRouters();

		// Afer Server has been set
		this.socketIOController();
    }

    /** Setters */

    private setHeaders() {}

    private setMiddlewares() {
        // Use static files
        // Public files
        this.app.use('/', Express.static(path.join(__dirname, '../', 'front', 'dist')))
    }

    private setRouters() {
        this.app.use('', defaultRouter);
    }

	private socketIOController()
	{

		const io = new Server<IClientToServerEvents, IServerToClientEvents, IInterServerEvents, ISocketData>(this.httpServer);

		io.on('connection', (socket: Socket) => {
			console.log('new user connected');
			socketIOController.loadData().then((data: IPixelData[]) => socket.emit('server-emit-pixels', data));

			socket.on('client-emit-newplace', (data: IPixelData) => {
				socketIOController.updatePixel(data)
				.then((response: any) => 
				{
					console.log('place new pixel', data);
					socket.broadcast.emit('server-emit-newpixel', data)
				})
				if (debugClient) socket.emit('server-emit-test', data);
			});
		})

	}


    /** Public methods */

    // Starts Server Program
    public start(givenMessage: string = `Server started on port: ${this.protocol}://${this.host}:${this.port}`) 
    {
		this.httpServer.listen(this.port, function() { console.log(givenMessage)})
    }


}