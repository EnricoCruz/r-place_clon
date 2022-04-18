import { IPixelData } from "../../types/socket.io";
import connectionPool from "../db";

const socketIOModel = {
    loadData: async function(data: any) {
        console.log(data.time);
        // const sql = `SELECT p1.pixelid, p1.color, p1.id, p1.time FROM placed p1
        // inner JOIN 
        // (SELECT pixelid, max(id) AS id FROM placed GROUP BY pixelid) p2
        // -- ON p1.pixelid = p2.pixelid AND p1.id = p2.id
        // USING (pixelid, id)
        // WHERE p1.time > 1 
        //  ORDER BY p1.pixelid ASC`;
        const sql = `SELECT p1.x, p1.y, p1.n, p1.color FROM pixels p1
        INNER JOIN (SELECT x, y, max(n) AS n FROM pixels GROUP BY x,y) p2 USING (x, y, n) 
        WHERE p1.time > ?
        ORDER BY p1.x ASC, p1.y ASC`;
        const promisePool = connectionPool.promise();
        return await promisePool.execute(sql, [data.time]);
    },
    updatePixel: async function(data: IPixelData) {
        // const sql = "INSERT INTO placed (pixelid, user, time, color) values (?, ?, ?, ?)";
        const sql = `INSERT INTO pixels (x, y, user_id, color, time) VALUES
        (?, ?, ?, ?, ?)`;
        const promisePool = connectionPool.promise();
        return await promisePool.execute(sql, [data.x, data.y, data.userid, data.color, data.time])
    }
}

export default socketIOModel;