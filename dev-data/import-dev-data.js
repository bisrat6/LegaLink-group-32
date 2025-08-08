import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

// Configure your PostgreSQL connection here
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'LegaLink',
  password: '123456',
  port: 5432,
});

async function importData(tableName, fileName) {
  try {
    const filePath = path.join('./dev-data', fileName);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const row of data) {
      const columns = Object.keys(row).join(', ');
      const values = Object.values(row);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

      const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

      await client.query(query, values);
      console.log(`Inserted into ${tableName}:`, row);
    }
  } catch (err) {
    console.error(`Error importing data into ${tableName}:`, err);
  }
}

async function main() {
  try {
    await client.connect();

    // Import data in the order that respects FK constraints
    await importData('categories', 'categories.json');
    await importData('users', 'users.json');
    await importData('lawyer_profiles', 'lawyer_profiles.json');
    await importData('cases', 'cases.json');
    await importData('bids', 'bids.json');
    await importData('ratings', 'ratings.json');
    await importData('messages', 'messages.json');
    await importData('notifications', 'notifications.json');

    console.log('All dev data imported successfully!');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  } finally {
    await client.end();
  }
}

main();
