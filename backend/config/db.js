import { Sequelize } from 'sequelize';
import pg from 'pg'; // explicit import — required for Vercel serverless
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_tMPB1r3DLayR@ep-tiny-pond-axoshw1m.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

let sequelize;

if (databaseUrl) {
  const isPostgres = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://');
  const dialect = isPostgres ? 'postgres' : 'mysql';

  sequelize = new Sequelize(databaseUrl, {
    dialect,
    dialectModule: isPostgres ? pg : undefined, // force-load pg explicitly
    logging: false,
    dialectOptions: isPostgres ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  const dbUser = process.env.DB_USER || 'neondb_owner';
  const dbPassword = process.env.DB_PASSWORD || 'npg_tMPB1r3DLayR';
  const dbHost = process.env.DB_HOST || 'ep-tiny-pond-axoshw1m.c-4.us-east-2.aws.neon.tech';
  const dbPort = process.env.DB_PORT || 5432;
  const dbName = process.env.DB_NAME || 'neondb';

  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: Number(dbPort),
    dialect: 'postgres',
    dialectModule: pg, // force-load pg explicitly
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

export default sequelize;
