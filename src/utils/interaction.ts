import { pool } from "../database/db";
import { MAX_CONCURRENT_STREAMS } from "./constants";

const interactionList = new Set<string>();

async function getActiveStreams() {
  const query = `
      SELECT DISTINCT interaction_id
      FROM pix_messages
      WHERE coletada = TRUE
        AND interaction_id IS NOT NULL
        AND coletada_em > NOW() - INTERVAL '15 minutes';   -- To consider only recents streams
    `;

  const result = await pool.query(query);
  const activeIds: string[] = result.rows.map((row) => row.interaction_id);

  return activeIds;
}

export async function initInteraction() {
  const activeIds = await getActiveStreams();
  activeIds.forEach((iid) => {
    interactionList.add(iid);
  });
}

export function addInteraction(iid: string) {
  if (interactionList.size >= MAX_CONCURRENT_STREAMS) return false;

  interactionList.add(iid);
  return true;
}

export function containsInteraction(iid: string) {
  return interactionList.has(iid);
}

export function removeInteraction(iid: string) {
  interactionList.delete(iid);
}
