import { prisma } from "../../config/config";
import { Stats } from "../../types/stats";

class StatsService {
  async updateStats(isMutant: boolean) {
    const stats = await prisma.stats.findUnique({ where: { id: "stats-id" } });

    if (!stats) {
      await prisma.stats.create({
        data: {
          id: "stats-id",
          count_mutant_dna: isMutant ? 1 : 0,
          count_human_dna: isMutant ? 0 : 1,
          ratio: await this.calculateRatio(isMutant ? 1 : 0, isMutant ? 0 : 1),
        },
      });
    } else {
      const newMutantCount = stats.count_mutant_dna + (isMutant ? 1 : 0);
      const newHumanCount = stats.count_human_dna + (isMutant ? 0 : 1);

      await prisma.stats.update({
        where: { id: "stats-id" },
        data: {
          count_mutant_dna: newMutantCount,
          count_human_dna: newHumanCount,
          ratio: await this.calculateRatio(newMutantCount, newHumanCount),
        },
      });
    }
  }

  private async calculateRatio(
    mutants: number,
    humans: number
  ): Promise<number> {
    if (humans === 0) return 0;
    return Number((mutants / humans).toFixed(2));
  }

  async getStats(): Promise<Stats> {
    const stats = await prisma.stats.findUnique({
      where: { id: "stats-id" },
    });

    if (!stats) {
      return {
        count_mutant_dna: 0,
        count_human_dna: 0,
        ratio: 0,
      };
    }

    const ratio = await this.calculateRatio(
      stats.count_mutant_dna,
      stats.count_human_dna
    );

    return {
      count_mutant_dna: stats.count_mutant_dna,
      count_human_dna: stats.count_human_dna,
      ratio,
    };
  }
}

export default StatsService;
