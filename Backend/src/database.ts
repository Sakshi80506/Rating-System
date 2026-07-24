import mysql, { Pool } from 'mysql2/promise';

let pool: Pool | null = null;

const databaseName = process.env.MYSQL_DATABASE || 'faculty_rating_system';

function getServerConfig() {
  return {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    port: Number(process.env.MYSQL_PORT || 3306),
  };
}

async function createTables(databasePool: Pool) {
  await databasePool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `);

  await databasePool.query(`
    CREATE TABLE IF NOT EXISTS normal_users (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      address VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `);

  await databasePool.query(`
    CREATE TABLE IF NOT EXISTS store_users (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      storeName VARCHAR(255) NOT NULL,
      ownerName VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `);

  const [storeColumns] = await databasePool.query('SHOW COLUMNS FROM store_users LIKE \'address\'');
  if (Array.isArray(storeColumns) && storeColumns.length === 0) {
    await databasePool.query(
      "ALTER TABLE store_users ADD COLUMN address VARCHAR(255) NOT NULL DEFAULT '' AFTER ownerName"
    );
  }

  await databasePool.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      normal_user_id INT NOT NULL,
      store_user_id INT NOT NULL,
      rating DECIMAL(3, 2) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (normal_user_id) REFERENCES normal_users(id),
      FOREIGN KEY (store_user_id) REFERENCES store_users(id)
    )
  `);
}

export async function initializeDatabase() {
  if (pool) {
    return pool;
  }

  const serverConfig = getServerConfig();
  const connection = await mysql.createConnection(serverConfig);

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
  await connection.end();

  pool = mysql.createPool({
    ...serverConfig,
    database: databaseName,
    waitForConnections: true,
    connectionLimit: 10,
  });

  await createTables(pool);

  return pool;
}

export function getDatabasePool() {
  if (!pool) {
    throw new Error('Database pool has not been initialized.');
  }

  return pool;
}
