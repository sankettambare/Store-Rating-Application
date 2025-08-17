const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: false
    });
    console.log('✅ MySQL connected successfully');
    await connection.end();
  } catch (err) {
    console.error('❌ MySQL connection error:', err);
  }
})();
