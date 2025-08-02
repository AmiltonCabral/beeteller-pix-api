import { Router } from "express";
import { generatePixMessages } from "../controllers/util.controller";

const router = Router();

router.post("/msgs/:ispb/:number", generatePixMessages);

export default router;
