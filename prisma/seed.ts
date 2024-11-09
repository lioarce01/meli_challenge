import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mutantDNA = [
  ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"],
  ["CTGAGG", "AATCGG", "TTCATT", "CGACCT", "AGGTCC", "CAGGGA"],
  ["GAGGTC", "CGTCTG", "CGTGCN", "GTGAGT", "GGTGGA", "CCGAGG"],
  ["TACGAG", "GGTGAG", "GAGTTT", "AGGAGG", "TCGATA", "CAGCGT"],
];

const humanDNA = [
  ["AGCTGA", "GTCAGT", "TTCGGA", "GACGAT", "TAGCTA", "ATGCAT"],
  ["AGGCTG", "GTCGTA", "ATTGCA", "CGTGGG", "GATCTA", "ATGCGT"],
  ["CAGTGC", "ATAGTA", "GTCGGA", "CTACAG", "GTGCAA", "CAGTAC"],
  ["AGTACG", "TACGGA", "CAGCTA", "TGTGAC", "GGATCC", "ATCGTC"],
  ["CGGATG", "TTCAGG", "GCTACG", "TGGACC", "ACTAGG", "ATCGTC"],
  ["CGTCTA", "GAGCTG", "TGTCCA", "GTCGAT", "ACTGAG", "ATGCGT"],
  ["ACGATG", "GGTGCA", "ATTCGA", "CAGGTC", "GTAGTA", "CGCTAG"],
  ["TGGAGC", "CAGTCA", "CTAGGT", "GATCGA", "TGCGAT", "GTACGT"],
  ["CGAGGA", "TGCATG", "ATGGAC", "CAGTGC", "TGAGGC", "ACGTAG"],
  ["GTCTAG", "AGCAGG", "CGAATA", "TTCGCA", "GCTACG", "TATGTC"],
];

async function seed() {
  await prisma.dNA.deleteMany({});
  await prisma.stats.deleteMany({});

  for (const dna of humanDNA) {
    await prisma.dNA.create({
      data: {
        dna: dna,
        dnaString: dna.join(""),
        isMutant: false,
      },
    });
  }

  for (const dna of mutantDNA) {
    await prisma.dNA.create({
      data: {
        dna: dna,
        dnaString: dna.join(""),
        isMutant: true,
      },
    });
  }

  await prisma.stats.create({
    data: {
      id: "stats-id",
      count_mutant_dna: mutantDNA.length,
      count_human_dna: humanDNA.length,
      ratio: mutantDNA.length / (mutantDNA.length + humanDNA.length),
    },
  });

  console.log("Seeding completed");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
