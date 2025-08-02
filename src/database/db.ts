import { Pool } from "pg";

require("dotenv").config();

if (!process.env.DB_URI) {
  console.error("FATAL ERROR: DB_URI environment variable not defined.");
  process.exit(1);
}

export const pool = new Pool({
  connectionString: process.env.DB_URI,
});

/**
 * Init the Database
 * Create the PIX table if not exists.
 */
export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS pix_messages (
        "endToEndId" VARCHAR(255) PRIMARY KEY,
        "valor" NUMERIC(12, 2) NOT NULL,
        "pagador" JSONB NOT NULL,
        "recebedor" JSONB NOT NULL,
        "campoLivre" TEXT,
        "txId" VARCHAR(255) NOT NULL,
        "dataHoraPagamento" TIMESTAMPTZ NOT NULL,

        -- Stream controll columns
        "coletada" BOOLEAN DEFAULT FALSE,
        "coletada_em" TIMESTAMPTZ,
        "interactionId" VARCHAR(255)
      );
    `);
    console.log("Database init success.");
  } catch (err) {
    console.error("Error initializing the Database.", err);
    process.exit(1);
  } finally {
    client.release();
  }
};
