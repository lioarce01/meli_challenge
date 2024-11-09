import { prisma } from "../../config/config";

class StatsService {
  async updateStats(isMutant: boolean) {
    const stats = await prisma.stats.findUnique({ where: { id: "stats-id" } });

    if (!stats) {
      await prisma.stats.create({
        data: {
          id: "stats-id",
          count_mutant_dna: isMutant ? 1 : 0,
          count_human_dna: isMutant ? 0 : 1,
          ratio: isMutant ? 1.0 : 0.0,
        },
      });
    } else {
      await prisma.stats.upsert({
        where: { id: "stats-id" },
        update: {
          count_mutant_dna: isMutant ? { increment: 1 } : undefined,
          count_human_dna: isMutant ? undefined : { increment: 1 },
        },
        create: {
          id: "stats-id",
          count_mutant_dna: isMutant ? 1 : 0,
          count_human_dna: isMutant ? 0 : 1,
          ratio: isMutant ? 1.0 : 0.0,
        },
      });
    }

    await this.calculateAndUpdateRatio();
  }

  async calculateAndUpdateRatio() {
    const stats = await prisma.stats.findUnique({ where: { id: "stats-id" } });
    if (!stats) return 0;

    const { count_mutant_dna, count_human_dna } = stats;

    if (count_human_dna === 0) {
      return count_mutant_dna > 0 ? 1.0 : 0.0;
    }

    return parseFloat((count_mutant_dna / count_human_dna).toFixed(2));
  }

  async getStats() {
    const stats = await prisma.stats.findUnique({
      where: { id: "stats-id" },
    });

    return stats || { count_human_dna: 0, count_mutant_dna: 0, ratio: 0.0 };
  }
}

export default StatsService;
