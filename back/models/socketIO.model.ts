import { IPixelData } from "../../types/socket.io";
import connectionPool from "../db";

const socketIOModel = {
    loadData: async function(data: any) {
        const sql = "SELECT pixelid, color, max(id) AS id, time FROM placed WHERE `time` > ?  GROUP BY (pixelid)ORDER BY pixelid ASC;";
        const promisePool = connectionPool.promise();
        return await promisePool.execute(sql, [data.time]);
    },
    updatePixel: async function(data: IPixelData) {
        const sql = "INSERT INTO placed (pixelid, user, time, color) values (?, ?, ?, ?)";
        const promisePool = connectionPool.promise();
        return await promisePool.execute(sql, [data.pixelid, data.userid, data.time, data.color])
    }
}

export default socketIOModel;