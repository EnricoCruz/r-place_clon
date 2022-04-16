import { IPixelData } from "../../types/socket.io";
import connectionPool from "../db";

const socketIOModel = {
    loadData: async function(data: any) {
        const sql = `SELECT p1.pixelid, p1.color, p1.id, p1.time FROM placed p1
        inner JOIN 
        (SELECT pixelid, max(id) AS id FROM placed GROUP BY pixelid) p2
        -- ON p1.pixelid = p2.pixelid AND p1.id = p2.id
        USING (pixelid, id)
        WHERE p1.time > 1 
         ORDER BY p1.pixelid ASC`;
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