import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'scrum_user',
  password: process.env.DB_PASSWORD || 'scrum_password',
  database: process.env.DB_NAME || 'scrum_board',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
    connection.release();
  } catch (err) {
    console.error('❌ Error connecting to MySQL database:', err.message);
    throw err;
  }
}
