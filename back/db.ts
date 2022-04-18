require('dotenv').config();
import mysql from 'mysql2';

const connectionPool = mysql.createPool({
    host: process.env.host ?? '',
    user: process.env.user ?? '',
    port: parseInt(process.env.port ?? '3306'),
    password: process.env.password ?? '',
    database: process.env.database ?? 'r_place_clon',
    waitForConnections: new Boolean(process.env.waitForConnections). valueOf() ?? true,
    connectionLimit: parseInt(process.env.connectionLimit ?? '10'),
    queueLimit: parseInt(process.env.queueLimit ?? '0'),
});

export default connectionPool;