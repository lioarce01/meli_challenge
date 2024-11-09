import { Request, Response } from "express";
import StatsService from "../../services/Stats/Stats";

class StatsController {
  private statsService: StatsService;

  constructor() {
    this.statsService = new StatsService();
    this.getStats = this.getStats.bind(this);
  }

  async getStats(req: Request, res: Response) {
    try {
      const stats = await this.statsService.getStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Error in getStats:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default StatsController;
