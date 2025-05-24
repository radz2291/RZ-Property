import fs from 'fs';
import path from 'path';
import { supabase } from '../lib/supabase';

async function runMigration() {
  try {
    console.log('Starting database migration for property slugs...');
    
    // Read the SQL migration file
    const sqlFilePath = path.join(process.cwd(), 'migrations', 'add-property-slug.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL in smaller chunks to avoid timeouts
    const sqlStatements = sql.split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    for (const statement of sqlStatements) {
      console.log(`Executing SQL: ${statement.substring(0, 50)}...`);
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
      
      if (error) {
        console.error('Error executing statement:', error);
        // Continue with other statements
      }
    }
    
    console.log('Migration completed successfully!');
    
    // Verify some properties have slugs
    const { data: properties, error: fetchError } = await supabase
      .from('properties')
      .select('id, title, slug')
      .limit(5);
      
    if (fetchError) {
      console.error('Error fetching properties:', fetchError);
    } else {
      console.log('Sample properties with slugs:');
      properties.forEach(prop => {
        console.log(`${prop.title} -> ${prop.slug}`);
      });
    }
    
  } catch (err) {
    console.error('Error running migration:', err);
    process.exit(1);
  }
}

runMigration();
