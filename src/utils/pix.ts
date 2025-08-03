import { randomBytes } from "crypto";
import type { Request } from "express";
import { pool } from "../database/db";

export function generateInteractionId() {
  return randomBytes(12).toString("hex");
}

/**
 * Get the message limit based on the Accept header
 */
export function getLimitFromHeaders(req: Request) {
  const acceptHeader = req.header("Accept");
  return acceptHeader === "multipart/json" ? 10 : 1;
}

/**
 * Search and block messages on the DB in a atomic process.
 * It is the main query that garantee concurrency.
 */
export async function fetchAndLockMessages(
  ispb: string,
  limit: number,
  interactionId: string
) {
  const query = `
    UPDATE pix_messages
    SET
        coletada = TRUE,
        interaction_id = $1,
        coletada_em = NOW()
    WHERE end_to_end_id IN (
        SELECT end_to_end_id
        FROM pix_messages
        WHERE recebedor_ispb = $2 AND coletada = FALSE
        ORDER BY data_hora_pagamento ASC
        LIMIT $3
        FOR UPDATE SKIP LOCKED
    )
    RETURNING *;
  `;

  const result = await pool.query(query, [interactionId, ispb, limit]);

  return result.rows;
}

export async function getActiveStreams(ispb: string | undefined) {
  const concurrencyCheckQuery = `
      SELECT COUNT(DISTINCT interaction_id) as active_streams
      FROM pix_messages
      WHERE recebedor_ispb = $1
        AND coletada = TRUE
        -- AND interaction_id IS NOT NULL
        AND coletada_em > NOW() - INTERVAL '15 minutes';   -- To consider only recents streams
    `;

  const concurrencyResult = await pool.query(concurrencyCheckQuery, [ispb]);
  const activeStreams = parseInt(concurrencyResult.rows[0].active_streams, 10);

  return activeStreams;
}
