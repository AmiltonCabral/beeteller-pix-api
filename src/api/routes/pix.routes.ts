import { Router } from "express";
import { startStream } from "../controllers/pix.controller";

const router = Router();

router.get("/:ispb/stream/start", startStream);

export default router;
