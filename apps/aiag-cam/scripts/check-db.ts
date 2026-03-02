
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function checkTables() {
  try {
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'aiag_schema';
    `);
    console.log("Tables in aiag_schema:", result);
    process.exit(0);
  } catch (error) {
    console.error("Error checking tables:", error);
    process.exit(1);
  }
}

checkTables();
