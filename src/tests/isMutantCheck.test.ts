import isMutant from "../utils/isMutantCheck";

describe("isMutant", () => {
  it("should return true if there are more than one sequence of four consecutive identical characters horizontally", () => {
    const mutantDNA = [
      "ATGCGA",
      "CAGTGC",
      "TTATGT",
      "AGAAGG",
      "CCCCTA",
      "TCACTG",
    ];
    expect(isMutant(mutantDNA)).toBe(true);
  });

  it("should return false if there is no sequence of four consecutive identical characters horizontally", () => {
    const humanDNA = [
      "ATGCGA",
      "CAGTGC",
      "TTATTT",
      "AGACGG",
      "GCGTCA",
      "TCACTG",
    ];
    expect(isMutant(humanDNA)).toBe(false);
  });

  it("should return true if there are more than one sequence of four consecutive identical characters vertically", () => {
    const mutantDNA = [
      "ATGCGA",
      "CAGTGC",
      "TTATGT",
      "AGAAGG",
      "CCCCTA",
      "TCACTG",
    ];
    expect(isMutant(mutantDNA)).toBe(true);
  });

  it("should return false if there are no vertical sequences of four consecutive identical characters", () => {
    const humanDNA = [
      "ATGCGA",
      "CAGTGC",
      "TTATTT",
      "AGACGG",
      "GCGTCA",
      "TCACTG",
    ];
    expect(isMutant(humanDNA)).toBe(false);
  });

  it("should return true if there are more than one sequence of four consecutive identical characters diagonally (top-left to bottom-right)", () => {
    const mutantDNA = [
      "ATGCGA",
      "CAGTGC",
      "TTATGT",
      "AGAAGG",
      "CCCCTA",
      "TCACTG",
    ];
    expect(isMutant(mutantDNA)).toBe(true);
  });

  it("should return true if there are more than one sequence of four consecutive identical characters diagonally (top-right to bottom-left)", () => {
    const mutantDNA = [
      "ATGCGA",
      "CAGTGC",
      "TTATGT",
      "AGAAGG",
      "CCCCTA",
      "TCACTG",
    ];
    expect(isMutant(mutantDNA)).toBe(true);
  });

  it("should return false for DNA with fewer than 4 rows", () => {
    const smallDNA = ["ATGC", "CAGT"];
    expect(isMutant(smallDNA)).toBe(false);
  });

  it("should return false for DNA with fewer than 4 columns", () => {
    const smallDNA = ["ATGC", "CAGT", "TATG"];
    expect(isMutant(smallDNA)).toBe(false);
  });
});
