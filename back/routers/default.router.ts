import path from 'path';
import { Request, Response, Router} from "express";

const defaultRouter = Router();


//TODO: Instal sockets to synchronize pixels

defaultRouter.get('/', (req: Request, res: Response) => {
    res.redirect('/main');
});

// Initial File
defaultRouter.get('/main', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../', '../', 'front', 'dist', 'index.html'));
});


export default defaultRouter;