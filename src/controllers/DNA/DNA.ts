import { Request, Response } from "express";
import DNAService from "../../services/DNA/DNA";

class DNAController {
  private dnaService: DNAService;

  constructor() {
    this.dnaService = new DNAService();
    this.checkMutant = this.checkMutant.bind(this);
  }

  private isValidDNA(dna: any): dna is string[] {
    return (
      Array.isArray(dna) &&
      dna.length > 0 &&
      dna.every((str) => typeof str === "string" && str.trim().length > 0)
    );
  }

  private handleErrorResponse(error: any, res: Response) {
    console.error("Error in checkMutant:", error.message);

    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "DNA sequence already exists in the database" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }

  async checkMutant(req: Request, res: Response) {
    const { dna } = req.body;

    if (!this.isValidDNA(dna)) {
      return res.status(400).json({ message: "Invalid DNA sequence" });
    }

    try {
      const result = await this.dnaService.saveDNA(dna);

      return res.status(result.status).json({
        isMutant: result.isMutant,
        message: result.isMutant ? "Mutant DNA detected" : "Human DNA detected",
      });
    } catch (error: any) {
      return this.handleErrorResponse(error, res);
    }
  }
}

export default DNAController;
