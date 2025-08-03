import { pool } from "../database/db";
import { MAX_CONCURRENT_STREAMS } from "./constants";

const interationList = new Set<string>();

async function getActiveStreams() {
  const query = `
      SELECT DISTINCT interation_id
      FROM pix_messages
      WHERE coletada = TRUE
        AND interation_id IS NOT NULL
        AND coletada_em > NOW() - INTERVAL '15 minutes';   -- To consider only recents streams
    `;

  const result = await pool.query(query);
  const activeIds: string[] = result.rows.map((row) => row.interation_id);

  return activeIds;
}

export async function initInteration() {
  const activeIds = await getActiveStreams();
  activeIds.forEach((iid) => {
    interationList.add(iid);
  });
}

export function addInteration(iid: string) {
  if (interationList.size >= MAX_CONCURRENT_STREAMS) return false;

  interationList.add(iid);
  return true;
}

export function containsInteration(iid: string) {
  return interationList.has(iid);
}

export function removeInteration(iid: string) {
  interationList.delete(iid);
}
