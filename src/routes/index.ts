import express from "express";
import DNAController from "../controllers/DNA/DNA";
import StatsController from "../controllers/Stats/Stats";

const router = express.Router();

const dnaController = new DNAController();
const statsController = new StatsController();

router.get("/stats", statsController.getStats);
router.post("/mutant", dnaController.checkMutant);

export default router;
