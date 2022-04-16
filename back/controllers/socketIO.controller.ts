import socketIOModel from '../models/socketIO.model';

module.exports = {
    updatePixel: socketIOModel.updatePixel,
    loadData: async function(lastTime?: number) {
        const data = await socketIOModel.loadData({time: lastTime ?? 0});
        console.log(data);
        if (data[0])
        {
            return data[0];
        }
        else return false;
    }
}