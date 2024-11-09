import DNAService from "../../services/DNA/DNA";
import { prisma } from "../../config/config";
import isMutantCheck from "../../utils/isMutantCheck";

jest.mock("../../utils/isMutantCheck");
jest.mock("../../config/config", () => ({
  prisma: {
    dNA: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    stats: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("DNAService", () => {
  let dnaService: DNAService;

  beforeEach(() => {
    dnaService = new DNAService();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("saveDNA", () => {
    it("should return existing mutant DNA with a 200 status if already stored", async () => {
      const mockDna = [
        "ATGCGA",
        "CAGTGC",
        "TTATGT",
        "AGAAGG",
        "CCCCTA",
        "TCACTG",
      ];
      const dnaString = JSON.stringify(mockDna);

      (isMutantCheck as jest.Mock).mockReturnValue(true);

      (prisma.dNA.findFirst as jest.Mock).mockResolvedValue({
        dna: mockDna,
        dnaString: dnaString,
        isMutant: true,
      });

      const result = await dnaService.saveDNA(mockDna);

      expect(result).toEqual({
        status: 200,
        dna: mockDna,
        isMutant: true,
      });

      expect(prisma.dNA.create).not.toHaveBeenCalled();
    });

    it("should return existing human DNA with a 403 status if already stored", async () => {
      const mockDna = [
        "ATGCGA",
        "CAGTGC",
        "TTATGT",
        "AGAAGG",
        "CCCCTA",
        "TCACTG",
      ];
      const dnaString = JSON.stringify(mockDna);

      (isMutantCheck as jest.Mock).mockReturnValue(false);

      (prisma.dNA.findFirst as jest.Mock).mockResolvedValue({
        dna: mockDna,
        dnaString: dnaString,
        isMutant: false,
      });

      const result = await dnaService.saveDNA(mockDna);

      expect(result).toEqual({
        status: 403,
        dna: mockDna,
        isMutant: false,
      });

      expect(prisma.dNA.create).not.toHaveBeenCalled();
    });

    it("should create and save mutant DNA if not already stored", async () => {
      const mockDna = [
        "ATGCGA",
        "CAGTGC",
        "TTATGT",
        "AGAAGG",
        "CCCCTA",
        "TCACTG",
      ];

      (isMutantCheck as jest.Mock).mockReturnValue(true);

      (prisma.dNA.findFirst as jest.Mock).mockResolvedValue(null);

      (prisma.dNA.create as jest.Mock).mockResolvedValue({
        dna: mockDna,
        dnaString: JSON.stringify(mockDna),
        isMutant: true,
      });

      const result = await dnaService.saveDNA(mockDna);

      expect(result.status).toBe(200);
      expect(result.isMutant).toBe(true);
    });

    it("should create and save human DNA if not already stored", async () => {
      const mockDna = [
        "ATGCGA",
        "CAGTGC",
        "TTATGT",
        "AGAAGG",
        "CCCCTA",
        "TCACTG",
      ];

      (isMutantCheck as jest.Mock).mockReturnValue(false);

      (prisma.dNA.findFirst as jest.Mock).mockResolvedValue(null);

      (prisma.dNA.create as jest.Mock).mockResolvedValue({
        dna: mockDna,
        dnaString: JSON.stringify(mockDna),
        isMutant: false,
      });

      const result = await dnaService.saveDNA(mockDna);

      expect(result.status).toBe(403);
      expect(result.isMutant).toBe(false);
    });
  });

  it("should return 409 if DNA sequence already exists due to unique constraint", async () => {
    const mockDna = [
      "ATGCGA",
      "CAGTGC",
      "TTATGT",
      "AGAAGG",
      "CCCCTA",
      "TCACTG",
    ];
    const normalizedDNA = mockDna.map((s) => s.trim().toUpperCase());
    const dnaString = JSON.stringify(normalizedDNA);

    (isMutantCheck as jest.Mock).mockReturnValue(true);

    (prisma.dNA.create as jest.Mock).mockRejectedValue({
      code: "P2002",
      message: "Unique constraint failed on the dnaString field",
    });

    const result = await dnaService.saveDNA(mockDna);

    expect(result).toEqual({
      status: 409,
      dna: normalizedDNA,
      isMutant: true,
      message: "DNA sequence already exists",
    });

    expect(prisma.dNA.create).toHaveBeenCalledWith({
      data: {
        dna: normalizedDNA,
        dnaString: dnaString,
        isMutant: true,
      },
    });
  });

  it("should throw an error if an unexpected error occurs", async () => {
    const mockDna = [
      "ATGCGA",
      "CAGTGC",
      "TTATGT",
      "AGAAGG",
      "CCCCTA",
      "TCACTG",
    ];

    (isMutantCheck as jest.Mock).mockReturnValue(false);

    (prisma.dNA.create as jest.Mock).mockRejectedValue(
      new Error("Database connection lost")
    );

    await expect(dnaService.saveDNA(mockDna)).rejects.toThrow(
      "Failed to save DNA: Database connection lost"
    );
  });
});
