const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

async function updatePassword() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://islamic_user:islamic_pass_2024@localhost:5432/islamic_articles?schema=public'
  });

  try {
    const hash = await bcrypt.hash('admin123', 10);
    console.log('Generated hash:', hash);
    
    const result = await pool.query(
      `UPDATE users SET password = $1 WHERE email = 'admin@qalamailm.com' RETURNING email`,
      [hash]
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Admin password updated successfully!');
      console.log('Email:', result.rows[0].email);
      console.log('Password: admin123');
    } else {
      console.log('❌ Admin user not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

updatePassword();

