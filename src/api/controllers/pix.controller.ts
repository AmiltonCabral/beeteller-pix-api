import type { Request, Response } from "express";
import {
  addInteration,
  containsInteration,
  removeInteration,
} from "../../utils/interation";
import {
  fetchAndLockMessages,
  generateInterationId,
  getLimitFromHeaders,
} from "../../utils/pix";
import {
  BATCH_WAIT_INTERVAL_MS,
  LONG_POLLING_TIMEOUT_MS,
} from "../../utils/constants";
import { pool } from "../../database/db";

export async function startStream(req: Request, res: Response) {
  const { ispb } = req.params;

  const interationId = generateInterationId();
  const interationAdded = addInteration(interationId);

  if (!interationAdded) {
    return res
      .status(429) // 429 (Too Many Requests)
      .json({
        error: "Limit of max concurrent streams reached, try again later",
      });
  }

  res.setHeader("Pull-Next", `/api/pix/${ispb}/stream/${interationId}`);

  return await getMessages(req, res, interationId);
}

export const continueStream = async (req: Request, res: Response) => {
  const { interationId } = req.params;

  if (!interationId) {
    return res.status(400).json({ error: "interationId is required." });
  }

  if (!containsInteration(interationId)) {
    return res.status(400).json({ error: "invalid interationId." });
  }

  await getMessages(req, res, interationId);
};

async function getMessages(req: Request, res: Response, interationId: string) {
  const { ispb } = req.params;
  if (!ispb) return res.status(400).json({ error: "ISPB is required." });

  const limit = getLimitFromHeaders(req);

  let messages = [];
  let elapsedTime = 0;

  // Long-Polling loop
  while (elapsedTime < LONG_POLLING_TIMEOUT_MS) {
    messages = await fetchAndLockMessages(ispb, limit, interationId);

    // If found messages, leave the loop
    if (messages.length > 0) break;

    // If not found, awaits a moment and try again
    await new Promise((resolve) => setTimeout(resolve, BATCH_WAIT_INTERVAL_MS));
    elapsedTime += BATCH_WAIT_INTERVAL_MS;
  }

  if (messages.length > 0) {
    const responseData = limit === 1 ? messages[0] : messages;
    return res.status(200).json(responseData);
  } else {
    // 204 (No Content)
    return res.status(204).send();
  }
}

export async function deleteStream(req: Request, res: Response) {
  const { ispb, interationId } = req.params;
  if (!ispb) {
    return res.status(400).json({ error: "ISPB is required." });
  }
  if (!interationId) {
    return res.status(400).json({ error: "interationId is required." });
  }

  const query = `
        DELETE
        FROM pix_messages
        WHERE coletada = TRUE
          AND interation_id = $1
      `;

  try {
    await pool.query(query, [interationId]);
  } catch (error) {
    const errorCode = `#${Date.now()}`;
    console.error(
      `Error generating the messages with code ${errorCode}`,
      error
    );
    res.status(500).json({
      error:
        "Internal error, please open a ticket and give the code ${errorCode}",
    });
  }

  removeInteration(interationId);

  return res.status(200).send("interationId removed with success");
}
