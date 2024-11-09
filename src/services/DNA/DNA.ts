import { prisma } from "../../config/config";
import isMutantCheck from "../../utils/isMutantCheck";
import StatsService from "../Stats/Stats";

const statsService = new StatsService();

type DNAResponse = {
  status: number;
  dna: string[];
  isMutant: boolean;
  message?: string;
};

class DNAService {
  // Utility function to normalize the DNA sequence
  private normalizeDNA(dna: string[]): string[] {
    return dna.map((s) => s.trim().toUpperCase());
  }

  // Main function to save DNA and determine if it is mutant or human
  async saveDNA(dna: string[]): Promise<DNAResponse> {
    const mutantStatus = isMutantCheck(dna);
    const normalizedDNA = this.normalizeDNA(dna);
    const dnaString = JSON.stringify(normalizedDNA);

    try {
      // Check if DNA already exists in the database
      const existingDNA = await prisma.dNA.findFirst({
        where: { dnaString },
      });

      if (existingDNA) {
        return {
          status: existingDNA.isMutant ? 200 : 403,
          dna: existingDNA.dna,
          isMutant: existingDNA.isMutant,
        };
      }

      // Save new DNA entry if it doesn't exist
      const savedDNA = await prisma.dNA.create({
        data: {
          dna: normalizedDNA,
          dnaString,
          isMutant: mutantStatus,
        },
      });

      // Update stats based on the mutant status
      await statsService.updateStats(mutantStatus);

      return {
        status: mutantStatus ? 200 : 403,
        dna: savedDNA.dna,
        isMutant: savedDNA.isMutant,
      };
    } catch (error: any) {
      console.error("Error saving DNA:", error);

      // Handle unique constraint error (P2002) from Prisma
      if (error.code === "P2002") {
        return {
          status: 409,
          dna: normalizedDNA,
          isMutant: mutantStatus,
          message: "DNA sequence already exists",
        };
      }

      // Re-throw any unexpected errors
      throw new Error(`Failed to save DNA: ${error.message}`);
    }
  }
}

export default DNAService;
