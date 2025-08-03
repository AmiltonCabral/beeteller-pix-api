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
