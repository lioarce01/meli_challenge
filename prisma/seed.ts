import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mutantDNA = [
  ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"],
  ["CTGAGG", "AATCGG", "TTCATT", "CGACCT", "AGGTCC", "CAGGGA"],
  ["GAGGTC", "CGTCTG", "CGTGCN", "GTGAGT", "GGTGGA", "CCGAGG"],
  ["TACGAG", "GGTGAG", "GAGTTT", "AGGAGG", "TCGATA", "CAGCGT"],
  ["AGTCGA", "ACGCGG", "CGTGTG", "GGTAGT", "TTGCAC", "TCACTG"],
  ["CGGACT", "TACGAT", "CAGTGT", "TGTAGT", "GCCTGA", "CGATGC"],
  ["CGTAGG", "ATGCTG", "TTCAGG", "GGACCC", "ATCGAG", "CGGTGA"],
  ["GGCATC", "CCTGGA", "AGTCAA", "GGTTCG", "AGAGGG", "CTGACT"],
  ["GATGCA", "CAGCGG", "GTTCAT", "GGATAG", "TCTGAT", "CGAAGG"],
];

const humanDNA = [
  ["GATTAC", "GCGTAG", "TGCATT", "AAGATG", "CTCGAC", "CGAGTG"],
  ["TACGGA", "AGTCTC", "CAGTGC", "ATGAGG", "GGATCA", "CTCAGT"],
  ["AGTTCG", "GGCTGA", "CTGAGT", "AAGTCG", "TTAGGA", "TGCATC"],
  ["ATGTAC", "CAGCGT", "CGGAGT", "TTTCGA", "AGGCAA", "TCCGTG"],
  ["ATCGAG", "CAGCTA", "TGTACG", "GCTGGA", "ATGCAT", "CGGAGT"],
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
