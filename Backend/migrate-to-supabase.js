/**
 * AETHERA MIGRATION SCRIPT: db.json -> Supabase PostgreSQL
 * 
 * Usage:
 * 1. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in Backend/.env
 * 2. Run: node Backend/migrate-to-supabase.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Load environment variables
function loadEnv() {
  const candidates = [path.join(__dirname, '.env'), path.join(ROOT_DIR, '.env')];
  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.substring(0, idx).trim();
          let val = trimmed.substring(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) process.env[key] = val;
        }
      });
    }
  }
}
loadEnv();

const dbService = require('./db-service');

async function runMigration() {
  console.log('====================================================');
  console.log('🚀 AETHERA DATA MIGRATION: db.json -> SUPABASE');
  console.log('====================================================');

  if (!dbService.isSupabaseEnabled()) {
    console.error('❌ Error: Supabase credentials not found in environment.');
    console.error('Please add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Backend/.env');
    process.exit(1);
  }

  const localDB = dbService.getLocalDB();
  const users = Object.values(localDB.users || {});
  const tokens = Object.entries(localDB.tokens || {});

  console.log(`Found ${users.length} user(s) and ${tokens.length} active token(s) in db.json.`);

  // 1. Migrate Users
  let userSuccess = 0;
  for (const user of users) {
    try {
      console.log(`- Migrating user: "${user.username}" (ID: ${user.id})...`);
      const ok = await dbService.saveUser(user);
      if (ok) {
        userSuccess++;
        console.log(`  ✓ Successfully uploaded user "${user.username}"`);
      } else {
        console.error(`  ✗ Failed to upload user "${user.username}"`);
      }
    } catch (err) {
      console.error(`  ✗ Error migrating user "${user.username}":`, err.message);
    }
  }

  // 2. Migrate Tokens
  let tokenSuccess = 0;
  for (const [token, data] of tokens) {
    try {
      const username = data.username;
      const ok = await dbService.saveToken(token, username);
      if (ok) tokenSuccess++;
    } catch (err) {
      console.error(`  ✗ Error migrating token:`, err.message);
    }
  }

  console.log('====================================================');
  console.log(`✅ Migration Complete:`);
  console.log(`   - Users migrated: ${userSuccess}/${users.length}`);
  console.log(`   - Tokens migrated: ${tokenSuccess}/${tokens.length}`);
  console.log('====================================================');
}

runMigration().catch(err => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
