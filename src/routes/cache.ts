import express from "express";
const router = express.Router();
import { getFromCache, setInCache, healthCheck } from "../controllers";
import { authenticateAccess } from "../middlewares";

router.get("/health", healthCheck);

router.post("/set", authenticateAccess, setInCache);
router.get("/get/:key", authenticateAccess, getFromCache);

export default router;
