import mysql from 'mysql2';

const connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'r_place_clon',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

export default connectionPool;