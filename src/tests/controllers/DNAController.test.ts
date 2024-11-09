import request from "supertest";
import express, { Express } from "express";
import DNAController from "../../controllers/DNA/DNA";
import DNAService from "../../services/DNA/DNA";
import { prisma } from "../../config/config";

jest.mock("../../services/DNA/DNA");

const mockDna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];

describe("DNAController", () => {
  let app: Express;
  let dnaServiceMock: jest.Mocked<DNAService>;
  let dnaController: DNAController;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    dnaServiceMock = new DNAService() as jest.Mocked<DNAService>;
    dnaController = new DNAController();

    dnaController["dnaService"] = dnaServiceMock;

    app.post("/mutant", dnaController.checkMutant);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and detect mutant DNA", async () => {
    const mockDna = [
      "ATGCGA",
      "CAGTGC",
      "TTATGT",
      "AGAAGG",
      "CCCCTA",
      "TCACTG",
    ];

    // Mock DNAService to return a mutant result
    dnaServiceMock.saveDNA.mockResolvedValue({
      status: 200,
      isMutant: true,
      dna: mockDna,
    });

    const response = await request(app).post("/mutant").send({ dna: mockDna });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      isMutant: true,
      message: "Mutant DNA detected",
    });
    expect(dnaServiceMock.saveDNA).toHaveBeenCalledWith(mockDna);
  });

  it("should return 400 for invalid DNA input", async () => {
    const invalidDna = { dna: "invalid data" };

    const response = await request(app).post("/mutant").send(invalidDna);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid DNA sequence" });
    expect(dnaServiceMock.saveDNA).not.toHaveBeenCalled();
  });

  it("should return 500 for internal server error", async () => {
    const mockDna = [
      "ATGCGA",
      "CAGTGC",
      "TTATGT",
      "AGAAGG",
      "CCCCTA",
      "TCACTG",
    ];

    dnaServiceMock.saveDNA.mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/mutant").send({ dna: mockDna });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
    expect(dnaServiceMock.saveDNA).toHaveBeenCalledWith(mockDna);
  });
});
