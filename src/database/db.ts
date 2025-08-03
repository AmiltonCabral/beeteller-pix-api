import { Pool } from "pg";
import { DB_URI } from "../utils/constants";

if (!DB_URI) {
  console.error("FATAL ERROR: DB_URI environment variable not defined.");
  process.exit(1);
}

export const pool = new Pool({
  connectionString: DB_URI,
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
        end_to_end_id VARCHAR(255) PRIMARY KEY,
        valor NUMERIC(12, 2) NOT NULL,
        pagador JSONB NOT NULL,
        recebedor JSONB NOT NULL,
        campo_livre TEXT,
        tx_id VARCHAR(255) NOT NULL,
        data_hora_pagamento TIMESTAMPTZ NOT NULL,
        recebedor_ispb VARCHAR(8) NOT NULL,
        coletada BOOLEAN DEFAULT FALSE,
        coletada_em TIMESTAMPTZ,
        interaction_id VARCHAR(255)
      );
    `);

    // create a compost index
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_recebedor_ispb
      ON pix_messages (recebedor_ispb, coletada);
    `);

    console.log("Database init with success.");
  } catch (err) {
    console.error("Error initializing the Database.", err);
    process.exit(1);
  } finally {
    client.release();
  }
};
