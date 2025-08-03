import type { Request, Response } from "express";
import { addInteraction, containsInteraction } from "../../utils/interaction";
import {
  fetchAndLockMessages,
  generateInteractionId,
  getLimitFromHeaders,
} from "../../utils/pix";
import {
  BATCH_WAIT_INTERVAL_MS,
  LONG_POLLING_TIMEOUT_MS,
} from "../../utils/constants";

export async function startStream(req: Request, res: Response) {
  const { ispb } = req.params;

  const interactionId = generateInteractionId();
  const interactionAdded = addInteraction(interactionId);

  if (!interactionAdded) {
    return res
      .status(429) // 429 (Too Many Requests)
      .json({
        error: "Limit of max concurrent streams reached, try again later",
      });
  }

  res.setHeader("Pull-Next", `/api/pix/${ispb}/stream/${interactionId}`);

  return await getMessages(req, res, interactionId);
}

export const continueStream = async (req: Request, res: Response) => {
  const { interationId } = req.params;

  if (!interationId) {
    return res.status(400).json({ error: "interationId is required." });
  }

  if (!containsInteraction(interationId)) {
    return res.status(400).json({ error: "invalid interationId." });
  }

  await getMessages(req, res, interationId);
};

async function getMessages(req: Request, res: Response, interactionId: string) {
  const { ispb } = req.params;
  if (!ispb) return res.status(400).json({ error: "ISPB is required." });

  const limit = getLimitFromHeaders(req);

  let messages = [];
  let elapsedTime = 0;

  // Long-Polling loop
  while (elapsedTime < LONG_POLLING_TIMEOUT_MS) {
    messages = await fetchAndLockMessages(ispb, limit, interactionId);

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
