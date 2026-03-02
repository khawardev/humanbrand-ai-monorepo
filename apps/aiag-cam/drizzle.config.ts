import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
config({ path: ".env.local" });

export default defineConfig({
    schema: './server/db/schema/*',
    out: './server/db/drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL_MIGRATIONS!,
    },
    schemaFilter: ['aiag_schema'],
});