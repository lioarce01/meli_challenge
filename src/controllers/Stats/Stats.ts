import { Request, Response } from "express";
import StatsService from "../../services/Stats/Stats";

const statsService = new StatsService();

class StatsController {
  async getStats(req: Request, res: Response) {
    try {
      const stats = await statsService.getStats();
      return res.status(200).json({
        count_mutant_dna: stats.count_mutant_dna,
        count_human_dna: stats.count_human_dna,
        ratio: stats.ratio,
      });
    } catch (error: any) {
      console.error("Error in getStats:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default StatsController;
