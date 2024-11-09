import StatsService from "../../services/Stats/Stats";
import { prisma } from "../../config/config";

jest.mock("../../config/config", () => ({
  prisma: {
    stats: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("StatsService", () => {
  let statsService: StatsService;

  beforeEach(() => {
    statsService = new StatsService();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("updateStats", () => {
    it("should create stats if no existing stats found", async () => {
      (prisma.stats.findUnique as jest.Mock).mockResolvedValue(null);

      (prisma.stats.create as jest.Mock).mockResolvedValue({
        count_mutant_dna: 1,
        count_human_dna: 0,
        ratio: 0,
      });

      const isMutant = true;

      await statsService.updateStats(isMutant);

      expect(prisma.stats.create).toHaveBeenCalledWith({
        data: {
          id: "stats-id",
          count_mutant_dna: 1,
          count_human_dna: 0,
          ratio: 0,
        },
      });
    });

    it("should update stats if they already exist", async () => {
      (prisma.stats.findUnique as jest.Mock).mockResolvedValue({
        id: "stats-id",
        count_mutant_dna: 2,
        count_human_dna: 3,
        ratio: 0.67,
      });

      (prisma.stats.update as jest.Mock).mockResolvedValue({
        id: "stats-id",
        count_mutant_dna: 3,
        count_human_dna: 3,
        ratio: 1,
      });

      const isMutant = true;

      await statsService.updateStats(isMutant);

      expect(prisma.stats.update).toHaveBeenCalledWith({
        where: { id: "stats-id" },
        data: {
          count_mutant_dna: 3,
          count_human_dna: 3,
          ratio: 1,
        },
      });
    });
  });

  describe("calculateRatio", () => {
    it("should calculate ratio correctly", async () => {
      const result = await statsService["calculateRatio"](3, 2);

      expect(result).toBe(1.5);
    });

    it("should return 0 if humans is 0", async () => {
      const result = await statsService["calculateRatio"](3, 0);

      expect(result).toBe(0);
    });
  });

  describe("getStats", () => {
    it("should return default stats if no stats found", async () => {
      (prisma.stats.findUnique as jest.Mock).mockResolvedValue(null);

      const stats = await statsService.getStats();

      expect(stats).toEqual({
        count_mutant_dna: 0,
        count_human_dna: 0,
        ratio: 0,
      });
    });

    it("should return stats if they exist", async () => {
      (prisma.stats.findUnique as jest.Mock).mockResolvedValue({
        id: "stats-id",
        count_mutant_dna: 5,
        count_human_dna: 10,
        ratio: 0.5,
      });

      const calculateRatioSpy = jest
        .spyOn(statsService, "calculateRatio" as any)
        .mockResolvedValue(0.5);

      const stats = await statsService.getStats();

      console.log("Received stats:", stats);

      expect(stats).toEqual({
        count_mutant_dna: 5,
        count_human_dna: 10,
        ratio: 0.5,
      });

      expect(calculateRatioSpy).toHaveBeenCalledWith(5, 10);

      calculateRatioSpy.mockRestore();
    });
  });
});
