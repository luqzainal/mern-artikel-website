import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database setup...');
    
    // Read and execute schema.sql
    console.log('📝 Creating database schema...');
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, '../../sql/schema.sql'),
      'utf-8'
    );
    await client.query(schemaSQL);
    console.log('✅ Schema created successfully');
    
    // Read and execute seed.sql
    console.log('🌱 Seeding initial data...');
    const seedSQL = fs.readFileSync(
      path.join(__dirname, '../../sql/seed.sql'),
      'utf-8'
    );
    await client.query(seedSQL);
    console.log('✅ Initial data seeded');
    
    // Hash admin password and update
    console.log('🔐 Setting up admin user password...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(
      `UPDATE users 
       SET password = $1 
       WHERE email = 'admin@qalamailm.com'`,
      [hashedPassword]
    );
    console.log('✅ Admin password set');
    
    console.log('\n✨ Database setup completed successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('   Email: admin@qalamailm.com');
    console.log('   Password: admin123');
    console.log('\n🌐 pgAdmin Access:');
    console.log('   URL: http://localhost:5050');
    console.log('   Email: admin@qalamailm.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run setup
setupDatabase().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

