// lib/db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'production', // Replace with your MySQL username
    password: 'Pass1234', // Replace with your MySQL password
    database: 'invent',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Function to test the MySQL connection
export const testConnection = async () => {
    let connection;
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Execute a simple query to test the connection
        await connection.query('SELECT 1');

        // Release the connection back to the pool
        connection.release();

        return { success: true, message: 'Connection to MySQL server successful!' };
    } catch (error) {
        // Handle connection errors
        if (connection) {
            connection.release(); // Ensure the connection is released even if there's an error
        }
        return { success: false, message: 'Failed to connect to MySQL server.', error };
    }
};

export default pool;