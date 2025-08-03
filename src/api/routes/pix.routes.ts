import { Router } from "express";
import { continueStream, startStream } from "../controllers/pix.controller";

const router = Router();

router.get("/:ispb/stream/start", startStream);

router.get("/:ispb/stream/:interationId", continueStream);

export default router;
