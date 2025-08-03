import type { Request, Response } from "express";
import {
  BATCH_WAIT_INTERVAL_MS,
  LONG_POLLING_TIMEOUT_MS,
  MAX_CONCURRENT_STREAMS,
} from "../../utils/constants";
import {
  fetchAndLockMessages,
  generateInteractionId,
  getActiveStreams,
  getLimitFromHeaders,
} from "../../utils/pix";

export async function startStream(req: Request, res: Response) {
  const { ispb } = req.params;

  const activeStreams = await getActiveStreams(ispb);

  if (activeStreams >= MAX_CONCURRENT_STREAMS) {
    return res
      .status(429) // 429 (Too Many Requests)
      .json({
        error: "Limit of max concurrent streams reached, try again later",
      });
  }

  return await getMessages(req, res);
}

async function getMessages(req: Request, res: Response) {
  const { ispb } = req.params;
  if (!ispb) return res.status(400).json({ error: "ISPB is required." });

  const limit = getLimitFromHeaders(req);
  const nextInteractionId = generateInteractionId();

  let messages = [];
  let elapsedTime = 0;

  // Long-Polling loop
  while (elapsedTime < LONG_POLLING_TIMEOUT_MS) {
    messages = await fetchAndLockMessages(ispb, limit, nextInteractionId);

    // If found messages, leave the loop
    if (messages.length > 0) break;

    // If not found, awaits a moment and try again
    await new Promise((resolve) => setTimeout(resolve, BATCH_WAIT_INTERVAL_MS));
    elapsedTime += BATCH_WAIT_INTERVAL_MS;
  }

  res.setHeader("Pull-Next", `/api/pix/${ispb}/stream/${nextInteractionId}`);

  if (messages.length > 0) {
    const responseData = limit === 1 ? messages[0] : messages;
    return res.status(200).json(responseData);
  } else {
    // 204 (No Content)
    return res.status(204).send();
  }
}
