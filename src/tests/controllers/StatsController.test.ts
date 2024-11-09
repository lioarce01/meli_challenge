import request from "supertest";
import express, { Express } from "express";
import StatsController from "../../controllers/Stats/Stats";
import StatsService from "../../services/Stats/Stats";

jest.mock("../../services/Stats/Stats", () => {
  return jest.fn().mockImplementation(() => ({
    getStats: jest.fn(),
  }));
});

describe("StatsController", () => {
  let app: Express;
  let statsServiceMock: jest.Mocked<StatsService>;
  let statsController: StatsController;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    statsServiceMock = new StatsService() as jest.Mocked<StatsService>;
    statsController = new StatsController();

    statsController["statsService"] = statsServiceMock;

    app.get("/stats", statsController.getStats);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and stats data on success", async () => {
    const mockStats = {
      count_mutant_dna: 40,
      count_human_dna: 100,
      ratio: 0.4,
    };

    statsServiceMock.getStats.mockResolvedValue(mockStats);

    const response = await request(app).get("/stats");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockStats);
    expect(statsServiceMock.getStats).toHaveBeenCalledTimes(1);
  });

  it("should return 500 if there is an internal server error", async () => {
    statsServiceMock.getStats.mockRejectedValue(
      new Error("Database connection failed")
    );

    const response = await request(app).get("/stats");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
    expect(statsServiceMock.getStats).toHaveBeenCalledTimes(1);
  });
});
