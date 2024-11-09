import { prisma } from "../../config/config";
import isMutantCheck from "../../utils/isMutantCheck";
import StatsService from "../Stats/Stats";

const statsService = new StatsService();

class DNAService {
  async saveDNA(dna: string[]): Promise<any> {
    const mutantStatus = isMutantCheck(dna);

    try {
      const normalizedDNA = dna.map((s) => s.trim().toUpperCase());
      const dnaString = JSON.stringify(normalizedDNA);

      const existingDNA = await prisma.dNA.findFirst({
        where: {
          dnaString: dnaString,
        },
      });

      if (existingDNA) {
        if (existingDNA.isMutant) {
          return {
            status: 200,
            dna: existingDNA.dna,
            isMutant: existingDNA.isMutant,
          };
        } else {
          return {
            status: 403,
            dna: existingDNA.dna,
            isMutant: existingDNA.isMutant,
          };
        }
      }

      const savedDNA = await prisma.dNA.create({
        data: {
          dna: normalizedDNA,
          dnaString: dnaString,
          isMutant: mutantStatus,
        },
      });

      await statsService.updateStats(mutantStatus);

      return {
        status: mutantStatus ? 200 : 403,
        dna: savedDNA.dna,
        isMutant: savedDNA.isMutant,
      };
    } catch (error: any) {
      console.error("Error saving DNA:", error);

      if (error.code === "P2002") {
        return { status: 409, message: "DNA sequence already exists" };
      }

      throw error;
    }
  }
}

export default DNAService;
