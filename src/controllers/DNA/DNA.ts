import { Request, Response } from "express";
import DNAService from "../../services/DNA/DNA";

const dnaService = new DNAService();

class DNAController {
  async checkMutant(req: Request, res: Response) {
    const { dna } = req.body;

    if (
      !dna ||
      !Array.isArray(dna) ||
      dna.length === 0 ||
      !dna.every((str) => typeof str === "string")
    ) {
      return res.status(400).json({ message: "Invalid DNA sequence" });
    }

    try {
      const result = await dnaService.saveDNA(dna);

      return res.status(result.status).json({
        isMutant: result.isMutant,
        message: result.isMutant ? "Mutant DNA detected" : "Human DNA detected",
      });
    } catch (error: any) {
      console.error("Error in checkMutant:", error.message);

      if (error.code === "P2002") {
        return res
          .status(409)
          .json({ message: "DNA sequence already exists in the database" });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default DNAController;
